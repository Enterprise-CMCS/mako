import { CommonEmailVariables, Events } from "shared-types";
import {
  Attachments,
  DetailsHeading,
  LoginInstructions,
  PackageDetails,
  SpamWarning,
} from "../../email-components";
import { emailTemplateValue } from "../data";
import { BaseEmailTemplate } from "../../email-templates";

export const MedSpaCMSEmail = (props: {
  variables: Events["NewMedicaidSubmission"] & CommonEmailVariables;
}) => {
  const variables = props.variables;
  const previewText = `Medicaid SPA ${variables.id} Submitted`;
  const heading =
    "The OneMAC Submission Portal received a Medicaid SPA Submission";

  return (
    <BaseEmailTemplate
      previewText={previewText}
      heading={heading}
      applicationEndpointUrl={variables.applicationEndpointUrl}
      footerContent={<SpamWarning />}
    >
      <DetailsHeading />
      <LoginInstructions appEndpointURL={variables.applicationEndpointUrl} />
      <PackageDetails
        details={{
          "State or territory": variables.territory,
          Name: variables.submitterName,
          Email: variables.submitterEmail,
          "Medicaid SPA ID": variables.id,
          "Proposed Effective Date": variables.proposedEffectiveDate,
          Summary: variables.additionalInformation,
        }}
      />
      <Attachments attachments={variables.attachments as any} />
    </BaseEmailTemplate>
  );
};

// To preview with on 'email-dev'
const MedSpaCMSEmailPreview = () => {
  return (
    <MedSpaCMSEmail
      variables={{
        ...emailTemplateValue,
        authority: "Medicaid SPA",
        event: "new-medicaid-submission",
        actionType: "Amend",
        origin: "mako",
      }}
    />
  );
};

export default MedSpaCMSEmailPreview;
