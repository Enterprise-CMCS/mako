<<<<<<< HEAD
import { WaiverStateEmail } from "../../../content/withdrawConfirmation/emailTemplates/WaiverState";
import { emailTemplateValue } from "../../../mock-data/new-submission";
=======
import { WaiverStateEmail } from "libs/email/content/withdrawConfirmation/emailTemplates";
import { emailTemplateValue } from "libs/email/mock-data/new-submission";
>>>>>>> ab59fff7 (feat(withdrawal-confirmation): medicaid and chip spa state withdrawal confirmation (#938))
import * as attachments from "../../../mock-data/attachments";

export default () => {
  return (
    <WaiverStateEmail
      variables={{
        ...emailTemplateValue,
        event: "withdraw-package",
        id: "CO-1234.R21.00",
        authority: "1915(b)",
        actionType: "Amend",
        territory: "CO",
        attachments: {
          officialWithdrawalLetter: attachments.withdrawRequest,
          supportingDocumentation: attachments.supportingDocumentation,
        },
      }}
    />
  );
};
