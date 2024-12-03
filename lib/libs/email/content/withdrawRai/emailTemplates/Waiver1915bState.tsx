import { CommonEmailVariables, Events } from "shared-types";
import {
  WithdrawRAI,
  PackageDetails,
  ContactStateLead,
  MailboxNotice,
  Attachments,
} from "../../email-components";
import { BaseEmailTemplate } from "../../email-templates";

export const Waiver1915bStateEmail = (props: {
  variables: Events["RespondToRai"] & CommonEmailVariables;
  relatedEvent: any;
}) => {
  const { variables, relatedEvent } = { ...props };
  const previewText = `Waiver ${variables.id} Withdrawn`;
  const heading = "This response confirms you have withdrawn a Waiver from CMS for review";
  return (
    <BaseEmailTemplate
      previewText={previewText}
      heading={heading}
      applicationEndpointUrl={variables.applicationEndpointUrl}
      footerContent={<ContactStateLead />}
    >
      <WithdrawRAI {...variables} />
      <PackageDetails
        details={{
          "State or territory": variables.territory,
          Name: relatedEvent.submitterName,
          "Email Address": relatedEvent.submitterEmail,
          "Waiver Number": variables.id,
          Summary: variables.additionalInformation,
        }}
      />
      <Attachments attachments={variables.attachments as any} />
      <MailboxNotice type="Waiver" />
    </BaseEmailTemplate>
  );
};
