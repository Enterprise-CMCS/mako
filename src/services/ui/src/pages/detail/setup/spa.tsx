import { removeUnderscoresAndCapitalize } from "@/utils";
import { isCmsUser } from "shared-utils";
import { LABELS } from "@/lib";
import { BLANK_VALUE } from "@/consts";
import { Authority, opensearch } from "shared-types";
import { ReactNode } from "react";
import { OneMacUser } from "@/api/useGetUser";
import { ReviewTeamList } from "@/components/PackageDetails/ReviewTeamList";
import { formatSeatoolDate } from "shared-utils";

export type DetailSectionItem = {
  label: string;
  value: ReactNode;
  canView: (u: OneMacUser | undefined) => boolean;
};
export const spaDetails = (
  data: opensearch.main.Document
): DetailSectionItem[] => [
  {
    label: "Waiver Authority",
    value: data.authority,
    canView: () => {
      console.log(data.authority);
      console.log(Authority.WAIVER);
      return data.authority?.toLowerCase() == Authority.WAIVER;
    },
  },
  {
    label: "Submission ID",
    value: data.id,
    canView: () => true,
  },
  {
    label: "State",
    value: data.state,
    canView: () => true,
  },
  {
    label: "Type",
    value: data?.authority
      ? removeUnderscoresAndCapitalize(data.authority)
      : BLANK_VALUE,
    canView: () => true,
  },
  {
    label: "Initial Submission Date",
    value: data.submissionDate
      ? formatSeatoolDate(data.submissionDate)
      : BLANK_VALUE,
    canView: () => true,
  },
  {
    label: "Proposed Effective Date",
    value: data.proposedDate
      ? formatSeatoolDate(data.proposedDate)
      : BLANK_VALUE,
    canView: () => true,
  },
  {
    label: "Approved Effective Date",
    value: data.approvedEffectiveDate
      ? formatSeatoolDate(data.approvedEffectiveDate)
      : BLANK_VALUE,
    canView: () => true,
  },
  {
    label: "Status Date",
    value: data.statusDate ? formatSeatoolDate(data.statusDate) : BLANK_VALUE,
    canView: (u) => (!u || !u.user ? false : isCmsUser(u.user)),
  },
  {
    label: "Final Disposition Date",
    value: data.finalDispositionDate
      ? formatSeatoolDate(data.finalDispositionDate)
      : BLANK_VALUE,
    canView: () => true,
  },
];

export const submissionDetails = (
  data: opensearch.main.Document
): DetailSectionItem[] => [
  {
    label: "Submitted By",
    value: <p className="text-lg">{data?.submitterName || BLANK_VALUE}</p>,
    canView: () => true,
  },
  {
    label: "Submission Source",
    value: <p className="text-lg">{data?.origin || BLANK_VALUE}</p>,
    canView: () => true,
  },
  {
    label: "Subject",
    value: <p>{data?.subject || BLANK_VALUE}</p>,
    canView: (u) => (!u || !u.user ? false : isCmsUser(u.user)),
  },
  {
    label: "Description",
    value: <p>{data?.description || BLANK_VALUE}</p>,
    canView: (u) => (!u || !u.user ? false : isCmsUser(u.user)),
  },
  {
    label: "CPOC",
    value: <p className="text-lg">{data?.leadAnalystName || BLANK_VALUE}</p>,
    canView: () => true,
  },
  {
    label: "Review Team (SRT)",
    value: <ReviewTeamList team={data.reviewTeam} />,
    canView: (u) => (!u || !u.user ? false : isCmsUser(u.user)),
  },
];
