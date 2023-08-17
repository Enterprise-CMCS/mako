import { OsMainSourceItem } from "shared-types";

export const SubmissionInfo = (data: OsMainSourceItem) => {
  const cpocName = `${data.leadAnalyst?.FIRST_NAME} ${data.leadAnalyst?.LAST_NAME}`;
  const submissionDetails = [
    {
      label: "Submitter",
      value: <p className="text-lg">{data.submitterName || "None"}</p>,
    },
    {
      label: "CPOC Name",
      value: <p className="text-lg">{cpocName || "None"}</p>,
    },
  ];
  return (
    <>
      <hr className="my-4" />
      <div className="grid grid-cols-2 gap-4">
        {submissionDetails.map(({ label, value }) => {
          return (
            <div key={label}>
              <h3 className="text-sm">{label}</h3>
              {value}
            </div>
          );
        })}
      </div>
    </>
  );
};
