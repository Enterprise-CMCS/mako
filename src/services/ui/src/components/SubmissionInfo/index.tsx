import { BLANK_VALUE } from "@/consts";
import { OsMainSourceItem } from "shared-types";

export const SubmissionInfo = (data: OsMainSourceItem) => {
  let cpocName = "";
  if (data.leadAnalystName) {
    cpocName = data.leadAnalystName;
  }

  const submissionSource = () => {
    const source = data?.origin?.toLowerCase();
    if (source === "seatool" || !source) return BLANK_VALUE;
    if (source === "onemac") return "OneMAC";
    return data?.origin;
  };
  const submissionDetails = [
    {
      label: "Submitted By",
      value: <p className="text-lg">{data.submitterName || BLANK_VALUE}</p>,
    },
    {
      label: "CPOC Name",
      value: <p className="text-lg">{cpocName || BLANK_VALUE}</p>,
    },
    {
      label: "Submission Source",
      value: <p className="text-lg">{submissionSource()}</p>,
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
