import * as React from "react";
import { emailTemplateValue } from "../data";
import { CommonEmailVariables } from "shared-types";
import { RaiWithdraw } from "shared-types";
import { Container, Html } from "@react-email/components";
import {
  WithdrawRAI,
  PackageDetails,
  ContactStateLead,
} from "../../email-components";
import { relatedEvent } from "./AppKCMS";

export const ChipSpaStateEmail = (props: {
  variables: RaiWithdraw & CommonEmailVariables;
  relatedEvent: any;
}) => {
  const { variables, relatedEvent } = { ...props };
  return (
    <Html lang="en" dir="ltr">
      <Container>
        <WithdrawRAI {...variables} />
        <PackageDetails
          details={{
            "State or territory": variables.territory,
            Name: relatedEvent.submitterName,
            "Email Address": relatedEvent.submitterEmail,
            "CHIP SPA Package ID": variables.id,
            Summary: variables.additionalInformation,
          }}
        />
        <ContactStateLead isChip />
      </Container>
    </Html>
  );
};

const ChipSpaStateEmailPreview = () => {
  return (
    <ChipSpaStateEmail
      relatedEvent={relatedEvent}
      variables={emailTemplateValue as any}
    />
  );
};

export default ChipSpaStateEmailPreview;
