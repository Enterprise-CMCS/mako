import { emailTemplateValue } from "../data";
import { Events } from "shared-types";
import { CommonVariables } from "../../..";
import { Html, Container } from "@react-email/components";
import {
  LoginInstructions,
  PackageDetails,
  SpamWarning,
} from "../../email-components";

export const ChipSpaCMSEmail = (props: {
  variables: Events["NewChipSubmission"] & CommonVariables;
}) => {
  const variables = props.variables;
  return (
    <Html lang="en" dir="ltr">
      <Container>
        <h3>
          The OneMAC Submission Portal received a CHIP State Plan Amendment:
        </h3>
        <LoginInstructions appEndpointURL={variables.applicationEndpointUrl} />
        <PackageDetails
          details={{
            "State or territory": variables.territory,
            Name: variables.submitterName,
            Email: variables.submitterEmail,
            "CHIP SPA Package ID": variables.id,
            Summary: variables.additionalInformation,
          }}
          attachments={variables.attachments}
        />
        <SpamWarning />
      </Container>
    </Html>
  );
};

// To preview with on 'email-dev'
const ChipSpaCMSEmailPreview = () => {
  return (
    <ChipSpaCMSEmail
      variables={{
        ...emailTemplateValue,
        event: "new-chip-submission",
        actionType: "Amend",
        origin: "mako",
      }}
    />
  );
};

export default ChipSpaCMSEmailPreview;
