import { emailTemplateValue } from "../data";
import { CommonEmailVariables, Events } from "shared-types";
import {
  Attachments,
  LoginInstructions,
  PackageDetails,
  SpamWarning,
} from "../../email-components";
import { BaseEmailTemplate } from "../../email-templates";

export const ChipSpaCMSEmail = (props: {
  variables: Events["NewChipSubmission"] & CommonEmailVariables;
}) => {
  const variables = props.variables;
  const previewText = `CHIP SPA ${variables.id} RAI Response Submitted`;
  const heading =
    "The OneMAC Submission Portal received a CHIP SPA RAI Response Submission";
  return (
    <BaseEmailTemplate
      previewText={previewText}
      heading={heading}
      applicationEndpointUrl={variables.applicationEndpointUrl}
      footerContent={<SpamWarning />}
    >
      <LoginInstructions appEndpointURL={variables.applicationEndpointUrl} />
      <PackageDetails
        details={{
          "State or territory": variables.territory,
          Name: variables.submitterName,
          "Email Address": variables.submitterEmail,
          "CHIP SPA Package ID": variables.id,
          Summary: variables.additionalInformation,
        }}
      />
      <Attachments attachments={variables.attachments as any} />
    </BaseEmailTemplate>
  );
};

const ChipSpaCMSEmailPreview = () => {
  return <ChipSpaCMSEmail variables={emailTemplateValue as any} />;
};

export default ChipSpaCMSEmailPreview;
