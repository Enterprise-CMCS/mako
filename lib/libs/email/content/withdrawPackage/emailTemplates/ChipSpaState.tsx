import { CommonEmailVariables, Events } from "lib/packages/shared-types";
import {
  AdditionalQuestionsNoticeForCHIPAndSPA,
  BasicFooter,
  PackageDetails,
} from "../../email-components";
import { BaseEmailTemplate } from "../../email-templates";

export const ChipSpaStateEmail = ({
  variables,
}: {
  variables: Events["WithdrawPackage"] & CommonEmailVariables;
}) => (
  <BaseEmailTemplate
    previewText={`CHIP SPA Package ${variables.id} Withdraw Request`}
    heading="This is confirmation that you have requested to withdraw the package below. The package will no longer be considered for CMS review:"
    applicationEndpointUrl={variables.applicationEndpointUrl}
    footerContent={<BasicFooter />}
  >
    <PackageDetails
      details={{
        "State or territory": variables.territory,
        Name: variables.submitterName,
        Email: variables.submitterEmail,
        "CHIP SPA Package ID": variables.id,
        Summary: variables.additionalInformation,
      }}
    />
    <AdditionalQuestionsNoticeForCHIPAndSPA isChip />
  </BaseEmailTemplate>
);
