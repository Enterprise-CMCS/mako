import { CommonEmailVariables, Events } from "shared-types";
import { ContactStateLead, BasicFooter, PackageDetails } from "../../email-components";
import { BaseEmailTemplate } from "../../email-templates";

export const WaiverStateEmail = (props: {
  variables:
    | (Events["CapitatedInitial"] & CommonEmailVariables)
    | (Events["ContractingInitial"] & CommonEmailVariables);
}) => {
  const variables = props.variables;
  const previewText = `Withdrawal of ${variables.authority} ${variables.id}`;
  const heading = `This is confirmation that you have requested to withdraw the package below. The package will no longer be considered for CMS review:`;
  return (
    <BaseEmailTemplate
      previewText={previewText}
      heading={heading}
      applicationEndpointUrl={variables.applicationEndpointUrl}
      footerContent={<BasicFooter />}
    >
      <PackageDetails
        details={{
          "State or territory": variables.territory,
          Name: variables.submitterName,
          "Email Address": variables.submitterEmail,
          "Waiver Number": variables.id,
          Summary: variables.additionalInformation,
        }}
      />
      <ContactStateLead />
    </BaseEmailTemplate>
  );
};
