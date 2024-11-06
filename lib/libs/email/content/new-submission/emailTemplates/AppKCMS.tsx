import { Events, CommonEmailVariables } from "shared-types";

import {
  LoginInstructions,
  PackageDetails,
  BasicFooter,
  DetailsHeading,
  Attachments,
} from "../../email-components";
import { BaseEmailTemplate } from "../../email-templates";
import { emailTemplateValue } from "../data";
import { formatDate } from "shared-utils";

type AppKEmailProps = Events["NewAppKSubmission"] & CommonEmailVariables;

// 1915c - app K
export const AppKCMSEmail = ({ variables }: { variables: AppKEmailProps }) => {
  return (
    <BaseEmailTemplate
      previewText="Appendix K Amendment Submitted"
      heading="The OneMAC Submission Portal received a 1915(c) Appendix K Amendment Submission:"
      applicationEndpointUrl={variables.applicationEndpointUrl}
      footerContent={<BasicFooter />}
    >
      <DetailsHeading />
      <LoginInstructions appEndpointURL={variables.applicationEndpointUrl} />
      <PackageDetails
        details={{
          "State or territory": variables.territory,
          Name: variables.submitterName,
          "Email Address": variables.submitterEmail,
          "Amendment Title": variables.title ?? null,
          "Waiver Amendment Number": variables.id,
          "Waiver Authority": variables.seaActionType,
          "Proposed Effective Date": formatDate(variables.proposedEffectiveDate),
          Summary: variables.additionalInformation,
        }}
      />
      <Attachments attachments={variables.attachments} />
    </BaseEmailTemplate>
  );
};

const AppKCMSEmailPreview = () => {
  return (
    <AppKCMSEmail
      variables={{
        ...emailTemplateValue,
        id: "CO-1234.R21.00",
        waiverIds: ["CO-1234.R21.01", "CO-12345.R03.09", "CO-4567.R15.42"],
        actionType: "Amend",
        seaActionType: "amend",
        state: "CO",
        title: "A Perfect Appendix K Amendment Title",
        attachments: {
          other: {
            files: [],
            label: "Other",
          },
          appk: {
            files: [
              {
                title: "Document title for App K Submission",
                filename: "Document title for App K Submission",
                bucket: "mako-outbox-attachments-635052997545",
                key: "b545ea14-6b1b-47c0-a374-743fcba4391f.pdf",
                uploadDate: 1728493782785,
              },
            ],
            label: "Appendix K",
          },
        },
      }}
    />
  );
};

export default AppKCMSEmailPreview;
