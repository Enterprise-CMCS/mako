import { DateTime } from "luxon";
import { decode } from "base-64";
import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";

import { KafkaEvent } from "shared-types";

const SES = new SESClient({ region: process.env.region });

const emailsToSend = {
  "new-submission-medicaid-spa": [{
    "templateBase": "new-submission-medicaid-spa-cms",
    "sendTo": [process.env.osgEmail],
  }, {
    "templateBase": "new-submission-medicaid-spa-state",
    "sendTo": ["submitterEmail"],
  }],
}

const createSendTemplatedEmailCommand = (data) =>
  new SendTemplatedEmailCommand({
    Source: process.env.emailSource ?? "kgrue@fearless.tech",
    Destination: {
      ToAddresses: data.ToAddresses,
      CcAddresses: data.CcAddresses,
    },
    TemplateData: JSON.stringify({ applicationEndpoint: process.env.applicationEndpoint, ...data }),
    Template: `${data.templateBase}_${process.env.stage}`,
    ConfigurationSetName: process.env.emailConfigSet,
  });

export const main = async (event: KafkaEvent) => {
  console.log("Received event (stringified):", JSON.stringify(event, null, 4));

  const emailQueue: any[] = [];

  Object.values(event.records).forEach((source) =>
    source.forEach((encodedRecord) => {
      if (!encodedRecord.value) return;
      const record = { id: decode(encodedRecord.key), ...JSON.parse(decode(encodedRecord.value)) };
      console.log("Decoded record: ", record);
      if (record?.origin !== "micro") return;
      if (!record?.actionType) record.actionType = "new-submission";

      const configKey = `${record.actionType}-${record.authority.replace(/\s+/g, "-")}`;
      const emailConfig = emailsToSend[configKey];

      // Early return if there's no configuration for the given key.
      if (!emailConfig) {
        console.log(`No email configuration found for: `, configKey);
        return;
      }
      console.log(`Matching email config: `, emailConfig);

      emailConfig.forEach(email => {
        const emailData = {
          ...email,
          ...record,
          ToAddresses: email.sendTo.map(address => mapAddress(address, record)),
          formattedFileList: formatAttachments(email.attachments, true),
          textFileList: formatAttachments(email.attachments, false),
          ninetyDaysDateNice: formatSubmissionDate(email.submissionDate)
        };

        emailQueue.push(emailData);
      });

      function mapAddress(address, record) {
        if (address === "submitterEmail")
          if (record.submitterEmail = "george@example.com")
            return `"George's Substitute" <k.grue.stateuser@gmail.com>`;
          else
            return `"${record.submitterName}" <${record.submitterEmail}>`;
        return address;
      }

      function formatAttachments(attachments, isHtml) {
        const joiner = isHtml ? '</li><li>' : '\n';
        const wrapWith = isHtml ? `<ul><li>${attachments.map(a => `${a.title}: ${a.filename}`).join(joiner)}</li></ul>` : `${attachments.map(a => `${a.title}: ${a.filename}`).join(joiner)}\n\n`;
        return wrapWith;
      }

      function formatSubmissionDate(submissionDate) {
        if (!submissionDate) return "Pending";
        return DateTime.fromMillis(submissionDate)
          .plus({ days: 90 })
          .toFormat("DDDD '@ 11:59pm' ZZZZ");
      }
    }));

  const sendResults = await Promise.all(emailQueue.map(async (theEmail) => {
    try {
      const sendTemplatedEmailCommand = createSendTemplatedEmailCommand(theEmail);
      console.log("the sendTemplatedEmailCommand is: ", JSON.stringify(sendTemplatedEmailCommand, null, 4));
      return await SES.send(sendTemplatedEmailCommand);
    } catch (err) {
      console.log("Failed to process theEmail.", err, JSON.stringify(theEmail, null, 4));
      return Promise.resolve(err);
    }
  }));

  console.log("the sendResults are: ", sendResults);
  return sendResults;
}
