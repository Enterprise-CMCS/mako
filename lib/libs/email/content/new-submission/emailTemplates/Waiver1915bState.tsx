import { DateTime } from "luxon";
import { emailTemplateValue } from "../data";
import { CommonEmailVariables } from "shared-types";
import { formatNinetyDaysDate } from "../../..";
import {
  Container,
  Head,
  Text,
  Html,
  Body,
  Heading,
  Preview,
} from "@react-email/components";
import {
  MailboxWaiver,
  PackageDetails,
  ContactStateLead,
  EmailNav,
  styles,
  DetailsHeading,
} from "../../email-components";

export const Waiver1915bStateEmail = (props: {
  variables: any & CommonEmailVariables;
}) => {
  const variables = props.variables;
  const previewText = `${variables.authority} ${variables.actionType} Submitted`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <EmailNav appEndpointUrl={variables.applicationEndpointUrl} />
          <div style={styles.primarySection}>
            <Heading style={styles.h1}>
              {`This response confirms the submission of your ${variables.authority} ${variables.actionType} to CMS for review:`}
            </Heading>
            <DetailsHeading />
            <PackageDetails
              details={{
                "State or territory": variables.territory,
                Name: variables.submitterName,
                "Email Address": variables.submitterEmail,
                [`${variables.actionType} Number`]: variables.id,
                "Waiver Authority": variables.authority,
                "Proposed Effective Date": DateTime.fromMillis(
                  Number(variables.notificationMetadata?.proposedEffectiveDate),
                ).toFormat("DDDD"),
                "90th Day Deadline": formatNinetyDaysDate(
                  variables.notificationMetadata?.submissionDate,
                ),
                Summary: variables.additionalInformation,
              }}
              attachments={variables.attachments}
            />
            <Text style={{ ...styles.text, marginTop: "16px" }}>
              {`This response confirms the receipt of your Waiver request or your
              response to a Waiver Request for Additional Information (RAI). You
              can expect a formal response to your submittal to be issued within
              90 days, before
              ${formatNinetyDaysDate(
                variables.notificationMetadata?.submissionDate,
              )}
              .`}
            </Text>
            <MailboxWaiver />
          </div>
          <ContactStateLead />
        </Container>
      </Body>
    </Html>
  );
};

// To preview with 'email-dev'
const Waiver1915bStateEmailPreview = () => {
  return (
    <Waiver1915bStateEmail
      variables={emailTemplateValue as any & CommonEmailVariables}
    />
  );
};

export default Waiver1915bStateEmailPreview;
