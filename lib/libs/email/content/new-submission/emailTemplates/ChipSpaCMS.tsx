import { emailTemplateValue } from "../data";
import { CommonEmailVariables, Events } from "shared-types";
import {
  LoginInstructions,
  PackageDetails,
  BasicFooter,
  DetailsHeading,
  Attachments,
} from "../../email-components";
import { BaseEmailTemplate } from "../../email-templates";

export const ChipSpaCMSEmail = (props: {
  variables: Events["NewChipSubmission"] & CommonEmailVariables;
}) => {
  const variables = props.variables;
  const previewText = `CHIP SPA ${variables.id} Submitted`;
  const heading = "The OneMAC Submission Portal received a CHIP State Plan Amendment";
  return (
    <BaseEmailTemplate
      previewText={previewText}
      heading={heading}
      applicationEndpointUrl={variables.applicationEndpointUrl}
      footerContent={<BasicFooter />}
    >
      <DetailsHeading />
      <LoginInstructions appEndpointURL={variables.applicationEndpointUrl} />
      <PackageDetails
        details={{
          "State or territory": variables.territory,
          Name: variables.submitterName,
          Email: variables.submitterEmail,
          "CHIP SPA Package ID": variables.id,
          Summary: variables.additionalInformation,
        }}
      />
      <Attachments attachments={variables.attachments} />
    </BaseEmailTemplate>
  );
};

const ChipSpaCMSEmailPreview = () => {
  return (
    <ChipSpaCMSEmail
      variables={{
        ...emailTemplateValue,
        id: "CO-24-1234",
        authority: "CHIP SPA",
        event: "new-chip-submission",
        actionType: "Amend",
      }}
    />
  );
};

export default ChipSpaCMSEmailPreview;
