import { emailTemplateValue } from "../data";
import { formatNinetyDaysDate } from "../../..";
import { CommonEmailVariables, RaiResponse } from "shared-types";
import { Text } from "@react-email/components";
import {
  ContactStateLead,
  PackageDetails,
  SpamWarning,
} from "../../email-components";
import { BaseEmailTemplate } from "../../email-templates";
import { styles } from "../../email-styles";

export const ChipSpaStateEmail = (props: {
  variables: RaiResponse & CommonEmailVariables;
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
      <PackageDetails
        details={{
          "State or territory": variables.territory,
          Name: variables.submitterName,
          "Email Address": variables.submitterEmail,
          "CHIP SPA Package ID": variables.id,
          "90th Day Deadline": formatNinetyDaysDate(variables.responseDate),
          Summary: variables.additionalInformation,
        }}
      />
      <Text style={styles.text.base}>
        This response confirms receipt of your CHIP State Plan Amendment (SPA or
        your response to a SPA Request for Additional Information (RAI)). You
        can expect a formal response to your submittal to be issued within 90
        days, before {formatNinetyDaysDate(variables.responseDate)}.
      </Text>
      <ContactStateLead isChip />
    </BaseEmailTemplate>
  );
};

const ChipSpaStateEmailPreview = () => {
  return <ChipSpaStateEmail variables={emailTemplateValue as any} />;
};

export default ChipSpaStateEmailPreview;
