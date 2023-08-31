import { OsMainSourceItem } from "shared-types";

export const SubmissionInfo = (data: OsMainSourceItem) => {
  let cpocName = "";
  if (data.leadAnalystName) {
    cpocName = data.leadAnalystName;
  }
  const submissionDetails = [
    {
      label: "Submitter",
      value: <p className="text-lg">{data.submitterName || "None"}</p>,
    },
    {
      label: "CPOC Name",
      value: <p className="text-lg">{cpocName || "None"}</p>,
    },
    {
      label: "Origin",
      value: <p className="text-lg">{data.origin || "unknown"}</p>,
    },
  ];
  return (
    <>
      <hr className="tw-my-4" />
      <div className="tw-grid tw-grid-cols-2 tw-gap-4">
        {submissionDetails.map(({ label, value }) => {
          return (
            <div key={label}>
              <h3 className="tw-text-sm">{label}</h3>
              {value}
            </div>
          );
        })}
      </div>
    </>
  );
};
