import { events, getStatus, SEATOOL_STATUS } from "shared-types";
import { seaToolFriendlyTimestamp } from "../../../../../shared-utils/seatool-date-helper";
import { LegacyEvent } from "../../../../events";


export const transform = () => {
  return events["legacy-event"].legacyEventSchema.transform((data) => {
    const { stateStatus, cmsStatus } = getStatus(SEATOOL_STATUS.SUBMITTED);
    const timestampDate = new Date(data.eventTimestamp);
    const todayEpoch = seaToolFriendlyTimestamp(timestampDate);

    return {
      additionalInformation: data.additionalInformation, 
      authority: data.waiverAuthority,
      actionType: "Renewal",
      changedDate: timestampDate.toISOString(), // eventTimestamp as ISO string
      cmsStatus, // Derived status
      description: null, // Not provided in legacy, set to null
      id: data.pk, // pk becomes id
      makoChangedDate: timestampDate.toISOString(),
      origin: "OneMAC",
      raiWithdrawEnabled: false,
      seatoolStatus: SEATOOL_STATUS.SUBMITTED,
      state: data.pk?.split("-")?.[0], // Extract state from pk
      stateStatus,
      statusDate: new Date(data.eventTimestamp).toISOString(),
      proposedDate: isNaN(new Date(data.proposedEffectiveDate).getTime()) ? null : data.proposedEffectiveDate, // Handle non date convertible data as null
      subject: null,
      submissionDate: new Date(data.eventTimestamp).toISOString(),
      submitterEmail: data.submitterEmail,
      submitterName: data.submitterName,
      initialIntakeNeeded: true,
      
    };
  });
};

export type Schema = ReturnType<typeof transform>;
