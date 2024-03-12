import { removeUnderscoresAndCapitalize, LABELS } from "@/utils";
import { OsTableColumn } from "@/components";
import { BLANK_VALUE } from "@/consts";
import { CMS_READ_ONLY_ROLES, UserRoles } from "shared-types";
import { useGetUser } from "@/api";
import {
  renderCellActions,
  renderCellDate,
  renderCellIdLink,
} from "../renderCells";
import { formatSeatoolDate } from "shared-utils";

export const useWaiverTableColumns = (): OsTableColumn[] => {
  const { data: props } = useGetUser();

  if (!props?.user) return [];

  return [
    {
      props: { className: "w-[150px]" },
      field: "id.keyword",
      label: "Waiver Number",
      locked: true,
      transform: (data) => data.id,
      cell: renderCellIdLink((id) => `/details?id=${encodeURIComponent(id)}`),
    },
    {
      field: "state.keyword",
      label: "State",
      transform: (data) => data.state ?? BLANK_VALUE,
      cell: (data) => data.state,
    },
    {
      field: "authority.keyword",
      label: "Type",
      transform: (data) => data.authority ?? BLANK_VALUE,
      cell: (data) =>
        data?.authority
          ? removeUnderscoresAndCapitalize(data.authority)
          : BLANK_VALUE,
    },
    {
      field: "actionType.keyword",
      label: "Action Type",
      transform: (data) => {
        if (data.actionType === undefined) return BLANK_VALUE;
        return (
          LABELS[data.actionType as keyof typeof LABELS] || data.actionType
        );
      },
      cell: (data) =>
        data.actionType
          ? LABELS[data.actionType as keyof typeof LABELS] || data.actionType
          : BLANK_VALUE,
    },
    {
      field: props?.isCms ? "cmsStatus.keyword" : "stateStatus.keyword",
      label: "Status",
      transform: (data) => {
        const status = (() => {
          if (!props?.isCms) return data.stateStatus;
          if (props?.user?.["custom:cms-roles"].includes(UserRoles.HELPDESK)) {
            return data.stateStatus;
          }
          return data.cmsStatus;
        })();

        const subStatusRAI = data.raiWithdrawEnabled
          ? " (Withdraw Formal RAI Response - Enabled)"
          : "";

        const subStatusInitialIntake = (() => {
          if (!props?.isCms) return "";
          if (!data.initialIntakeNeeded) return "";
          return " (Initial Intake Needed)";
        })();

        return `${status}${subStatusRAI}${subStatusInitialIntake}`;
      },
      cell: (data) => {
        const status = (() => {
          if (!props?.isCms) return data.stateStatus;
          if (props.user?.["custom:cms-roles"].includes(UserRoles.HELPDESK))
            return data.stateStatus;
          return data.cmsStatus;
        })();

        return (
          <>
            <p>{status}</p>
            {data.raiWithdrawEnabled && (
              <p className="text-xs opacity-60">
                · Withdraw Formal RAI Response - Enabled
              </p>
            )}
            {props?.isCms && data.initialIntakeNeeded && (
              <p className="text-xs opacity-60">· Initial Intake Needed</p>
            )}
          </>
        );
      },
    },
    {
      field: "submissionDate",
      label: "Initial Submission",
      transform: (data) =>
        data?.submissionDate
          ? formatSeatoolDate(data.submissionDate)
          : BLANK_VALUE,
      cell: renderCellDate("submissionDate"),
    },
    {
      field: "origin",
      label: "Submission Source",
      hidden: true,
      cell: (data) => {
        return data.origin;
      },
    },
    {
      field: "raiRequestedDate",
      label: "Formal RAI Requested",
      hidden: true,
      cell: renderCellDate("raiRequestedDate"),
    },
    {
      field: "raiReceivedDate",
      label: "Formal RAI Response",
      transform: (data) => {
        return data.raiReceivedDate && !data.raiWithdrawnDate
          ? formatSeatoolDate(data.raiReceivedDate)
          : BLANK_VALUE;
      },
      cell: renderCellDate("raiReceivedDate"),
    },
    {
      field: "leadAnalystName.keyword",
      label: "CPOC Name",
      hidden: true,
      transform: (data) => data.leadAnalystName ?? BLANK_VALUE,
      cell: (data) => data.leadAnalystName,
    },
    {
      field: "submitterName.keyword",
      label: "Submitted By",
      transform: (data) => data.submitterName ?? BLANK_VALUE,
      cell: (data) => data.submitterName,
    },
    // hide actions column for: readonly,help desk
    ...(!CMS_READ_ONLY_ROLES.some((UR) =>
      props.user?.["custom:cms-roles"].includes(UR)
    )
      ? [
          {
            locked: true,
            isSystem: true,
            label: "Actions",
            cell: renderCellActions(props.user),
          },
        ]
      : []),
  ];
};
