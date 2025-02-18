import { useGetItem, useGetPackageActions } from "@/api";
import { LoadingSpinner } from "@/components";
import { WAIVER_SUBMISSION_ORIGIN, DETAILS_ORIGIN, ORIGIN, mapActionLabel } from "@/utils";
import { DetailCardWrapper } from "..";
import { FC } from "react";
import { Link, useLocation } from "react-router";

export const PackageActionsCard: FC<{ id: string }> = ({ id }) => {
  const location = useLocation();
  const item = useGetItem(id);

  const { data, isLoading } = useGetPackageActions(id, {
    retry: false,
  });
  if (isLoading) return <LoadingSpinner />;

  if (!data?.actions?.length) {
    return (
      <DetailCardWrapper title={"Package Actions"}>
        <div className="my-3">
          <em className="text-gray-400 my-3">
            No actions are currently available for this submission.
          </em>
        </div>
      </DetailCardWrapper>
    );
  }

  return (
    <DetailCardWrapper title={"Package Actions"}>
      <div className="my-3">
        <ul className="my-3">
          {data.actions.map((type, idx) => (
            <Link
              key={`${idx}-${type}`}
              state={{
                from: `${location.pathname}${location.search}`,
              }}
              to={{
                pathname: `/actions/${type}/${item.data?._source.authority}/${id}`,
                search: new URLSearchParams({
                  [ORIGIN]:
                    type === "amend-waiver" || type === "temporary-extension"
                      ? WAIVER_SUBMISSION_ORIGIN
                      : DETAILS_ORIGIN,
                }).toString(),
              }}
              className="text-sky-700 font-semibold text-lg"
            >
              <li>{mapActionLabel(type)}</li>
            </Link>
          ))}
        </ul>
      </div>
    </DetailCardWrapper>
  );
};
