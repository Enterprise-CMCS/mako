import {
  Alert,
  CardWithTopBorder,
  ConfirmationModal,
  DetailItemsGrid,
  DetailsSection,
  ErrorAlert,
  LoadingSpinner,
} from "@/components";
import { useGetUser } from "@/api/useGetUser";
import { Action, opensearch, UserRoles } from "shared-types";
import { PackageCheck } from "shared-utils";
import { useQuery } from "@/hooks";
import { useGetItem } from "@/api";
import { BreadCrumbs } from "@/components/BreadCrumb";
import { mapActionLabel } from "@/utils";
import { useLocation } from "react-router-dom";
import { useGetPackageActions } from "@/api/useGetPackageActions";
import { PropsWithChildren, useState } from "react";
import { detailsAndActionsCrumbs } from "@/pages/actions/actions-breadcrumbs";
import { API } from "aws-amplify";
import { getStatus } from "shared-types/statusHelper";
import { spaDetails, submissionDetails } from "@/pages/detail/setup/spa";
import { Link } from "@/components/Routing";
import { PackageActivities } from "./package-activity";
import { AdminChanges } from "./admin-changes";

const DetailCardWrapper = ({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) => (
  <CardWithTopBorder className="max-w-[18rem]">
    <div className="p-4">
      <h2>{title}</h2>
      {children}
    </div>
  </CardWithTopBorder>
);
const StatusCard = (data: opensearch.main.Document) => {
  const transformedStatuses = getStatus(data.seatoolStatus);
  const checker = PackageCheck(data);
  const { data: user } = useGetUser();

  return (
    <DetailCardWrapper title={"Status"}>
      <div>
        <h2 className="text-xl font-semibold">
          {user?.isCms &&
          !user.user?.["custom:cms-roles"].includes(UserRoles.HELPDESK)
            ? transformedStatuses.cmsStatus
            : transformedStatuses.stateStatus}
        </h2>
        {checker.hasEnabledRaiWithdraw && (
          <em className="text-xs my-4 mr-2">
            {"Withdraw Formal RAI Response - Enabled"}
          </em>
        )}
        {user?.isCms && checker.isInSecondClock && (
          <span id="secondclock" className="ml-2">
            2nd Clock
          </span>
        )}
      </div>
    </DetailCardWrapper>
  );
};
const PackageActionsCard = ({ id }: { id: string }) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useGetPackageActions(id, { retry: false });
  if (isLoading) return <LoadingSpinner />;
  return (
    <DetailCardWrapper title={"Actions"}>
      <div>
        {!data || !data.actions.length ? (
          <em className="text-gray-400">
            No actions are currently available for this submission.
          </em>
        ) : (
          <ul>
            {data.actions.map((type, idx) => {
              return (
                <Link
                  key={`${idx}-${type}`}
                  path="/action/:id/:type"
                  params={{ id, type }}
                  className="text-sky-500 underline"
                >
                  <li>{mapActionLabel(type)}</li>
                </Link>
              );
            })}
          </ul>
        )}
      </div>

      {/* Withdraw Modal */}
      <ConfirmationModal
        open={isWithdrawModalOpen}
        onAccept={async () => {
          setIsWithdrawModalOpen(false);
          const dataToSubmit = {
            id,
          };
          try {
            setIsLoading(true);
            await API.post("os", `/action/${Action.WITHDRAW_RAI}`, {
              body: dataToSubmit,
            });
            setIsLoading(false);
            setIsWithdrawModalOpen(false); // probably want a success modal?
            setIsSuccessModalOpen(true);
          } catch (err) {
            setIsLoading(false);
            setIsErrorModalOpen(true);
            console.log(err); // probably want an error modal?
          }
        }}
        onCancel={() => setIsWithdrawModalOpen(false)}
        title="Withdraw RAI"
        body={
          <p>
            Are you sure you would like to withdraw the RAI response for{" "}
            <em>{id}</em>?
          </p>
        }
      />

      {/* Withdraw Success Modal */}
      <ConfirmationModal
        open={isSuccessModalOpen}
        onAccept={async () => {
          setIsSuccessModalOpen(false);
        }}
        onCancel={() => setIsSuccessModalOpen(false)}
        title="Withdraw RAI Successful"
      />

      {/* Withdraw Error Modal */}
      <ConfirmationModal
        open={isErrorModalOpen}
        onAccept={async () => {
          setIsErrorModalOpen(false);
        }}
        onCancel={() => setIsErrorModalOpen(false)}
        title="Failed to Withdraw"
        body="RAI withdraw failed"
      />
    </DetailCardWrapper>
  );
};

export const DetailsContent = ({
  data,
}: {
  data?: opensearch.main.ItemResult;
}) => {
  const { state } = useLocation();
  if (!data?._source) return <LoadingSpinner />;
  return (
    <div className="block md:flex">
      <aside className="flex-none font-bold hidden md:block pr-8">
        {[
          "Package Overview",
          "Package Details",
          "Attachments",
          "Additional Info",
        ].map((val) => (
          <a
            className="block mb-4 text-primary"
            key={val}
            href={`?id=${encodeURIComponent(data._id)}#${val
              .toLowerCase()
              .split(" ")
              .join("-")}`}
          >
            {val}
          </a>
        ))}
      </aside>
      <div className="flex-1">
        {state?.callout && (
          <Alert className="bg-green-100 border-green-400" variant="default">
            <h2 className="text-lg font-bold text-green-900">
              {state.callout.heading}
            </h2>
            <p className="text-green-900">{state.callout.body}</p>
          </Alert>
        )}
        <section
          id="package-overview"
          className="sm:flex lg:grid lg:grid-cols-2 gap-4 my-6"
        >
          <StatusCard {...data._source} />
          <PackageActionsCard id={data._id} />
        </section>
        <div className="flex flex-col gap-3">
          <DetailsSection id="package-details" title="Medicaid Package Details">
            <DetailItemsGrid displayItems={spaDetails(data._source)} />
            <DetailItemsGrid displayItems={submissionDetails(data._source)} />
          </DetailsSection>
          <PackageActivities {...data._source} />
          <AdminChanges {...data._source} />
        </div>
      </div>
    </div>
  );
};

export const Details = () => {
  const query = useQuery();
  const id = query.get("id") as string;
  const { data, isLoading, error } = useGetItem(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto py-1 px-4 lg:px-8 flex flex-col gap-4">
        <BreadCrumbs options={detailsAndActionsCrumbs({ id })} />
        <DetailsContent data={data} />
      </div>
    </>
  );
};
