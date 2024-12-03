import { CommonEmailVariables, Events } from "shared-types";
import { Container, Html } from "@react-email/components";
import { ContactStateLead } from "../../email-components";

export const MedSpaStateEmail = (props: {
  variables: Events["WithdrawPackage"] & CommonEmailVariables;
}) => {
  const variables = props.variables;
  return (
    <Html lang="en" dir="ltr">
      <Container>
        <h3>
          This email is to confirm Medicaid SPA {variables.id} was withdrawn by
          {variables.submitterName}. The review of Medicaid SPA {variables.id} has concluded.
        </h3>
        <ContactStateLead />
      </Container>
    </Html>
  );
};
