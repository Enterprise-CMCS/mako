import { SEATOOL_STATUS, getStatus } from "shared-types";
import * as newSubmission from "../../../events/new-medicaid-submission";
import {
  getNextBusinessDayTimestamp,
  seaToolFriendlyTimestamp,
} from "../../../../shared-utils/seatool-date-helper";

export const transform = () => {
  // any adhoc logic
  return newSubmission.schema.transform((data) => {
    const { stateStatus, cmsStatus } = getStatus(SEATOOL_STATUS.PENDING);
    const timestampDate = new Date(data.timestamp);
    const todayEpoch = seaToolFriendlyTimestamp(timestampDate);
    const nextBusinessDayEpoch = getNextBusinessDayTimestamp(timestampDate);
    return {
      additionalInformation: data.additionalInformation,
      attachments: data.attachments,
      authority: data.authority,
      changedDate: new Date(data.timestamp).toISOString(),
      cmsStatus,
      description: null,
      id: data.id,
      makoChangedDate: new Date(data.timestamp).toISOString(),
      origin: "OneMAC",
      raiWithdrawEnabled: false, // Set to false for new submissions
      seatoolStatus: SEATOOL_STATUS.PENDING,
      state: data.id.split("-")[0],
      stateStatus,
      statusDate: new Date(todayEpoch).toISOString(),
      subject: null,
      submissionDate: new Date(nextBusinessDayEpoch).toISOString(),
      submitterEmail: data.submitterEmail,
      submitterName: data.submitterName,
    };
  });
};

export type Schema = ReturnType<typeof transform>;
