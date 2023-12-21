import {
  AdditionalInfo,
  Alert,
  Attachmentslist,
  CardWithTopBorder,
  DetailsSection,
  ErrorAlert,
  LoadingSpinner,
  RaiList,
  ConfirmationModal,
} from "@/components";
import { useGetUser } from "@/api/useGetUser";
import { ItemResult, UserRoles, Action } from "shared-types";
import { useQuery } from "@/hooks";
import { useGetItem } from "@/api";
import { BreadCrumbs } from "@/components/BreadCrumb";
import { mapActionLabel } from "@/utils";
import { Link, useLocation } from "react-router-dom";
import { useGetPackageActions } from "@/api/useGetPackageActions";
import { PropsWithChildren, useState } from "react";
import { DETAILS_AND_ACTIONS_CRUMBS } from "@/pages/actions/actions-breadcrumbs";
import { API } from "aws-amplify";
import { SEATOOL_STATUS, getStatus } from "shared-types/statusHelper";
import { isCmsUser } from "shared-utils";
import { DetailItemsGrid } from "@/components";
import { spaDetails, submissionDetails } from "@/pages/detail/setup/spa";

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
const StatusCard = ({
  status,
  raiWithdrawEnabled,
  raiRecievedDate,
}: {
  status: string;
  raiWithdrawEnabled: boolean;
  raiRecievedDate: string;
}) => {
  const transformedStatuses = getStatus(status);
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
        {raiWithdrawEnabled && (
          <em className="text-xs">
            {"Withdraw Formal RAI Response - Enabled"}{" "}
          </em>
        )}
        {/* Display 2nd Clock if status is pending and latestRaiResponseTimestamp is present.*/}
        {user?.isCms &&
          [
            SEATOOL_STATUS.PENDING,
            SEATOOL_STATUS.PENDING_APPROVAL,
            SEATOOL_STATUS.PENDING_CONCURRENCE,
          ].includes(status) &&
          raiRecievedDate && <span id="secondclock">2nd Clock</span>}
      </div>
    </DetailCardWrapper>
  );
};
const PackageActionsCard = ({ id }: { id: string }) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data, error } = useGetPackageActions(id);
  if (!data?.actions || error || isLoading) return <LoadingSpinner />;
  return (
    <DetailCardWrapper title={"Actions"}>
      <div>
        {!data.actions.length ? (
          <em className="text-gray-400">
            No actions are currently available for this submission.
          </em>
        ) : (
          <ul>
            {data.actions.map((action, idx) => {
              return (
                <Link
                  className="text-sky-500 underline"
                  to={`/action/${id}/${action}`}
                  key={`${idx}-${action}`}
                >
                  <li>{mapActionLabel(action)}</li>
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

export const DetailsContent = ({ data }: { data?: ItemResult }) => {
  const { data: user } = useGetUser();
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
          <StatusCard
            status={data._source.seatoolStatus}
            raiWithdrawEnabled={data._source?.raiWithdrawEnabled || false}
            //NOTE: 2nd clock will not display after Formal RAI Response Date is cleared
            raiRecievedDate={
              !data._source.raiWithdrawnDate
                ? data._source?.raiReceivedDate || ""
                : ""
            }
          />
          <PackageActionsCard id={data._id} />
        </section>
        <h2 className="text-xl font-semibold mb-2">{"Package Details"}</h2>
        <DetailItemsGrid displayItems={spaDetails(data._source)} />
        <DetailItemsGrid displayItems={submissionDetails(data._source)} />
        {/* Below is used for spacing. Keep it simple */}
        <div className="mb-4" />
        <DetailsSection id="attachments" title="Attachments">
          <Attachmentslist {...data?._source} />
        </DetailsSection>
        <DetailsSection id="additional-info" title="Additional Information">
          <AdditionalInfo
            additionalInformation={data?._source.additionalInformation}
          />
        </DetailsSection>
        <RaiList {...data?._source} />
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
        <BreadCrumbs options={DETAILS_AND_ACTIONS_CRUMBS({ id })} />
        <DetailsContent data={data} />
      </div>
    </>
  );
};
