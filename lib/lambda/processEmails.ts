import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { EmailAddresses, KafkaEvent, KafkaRecord, opensearch, SEATOOL_STATUS } from "shared-types";
import { decodeBase64WithUtf8, getSecret } from "shared-utils";
import { Handler } from "aws-lambda";
import { getEmailTemplates, getAllStateUsers } from "libs/email";
import * as os from "libs/opensearch-lib";
import { EMAIL_CONFIG, getCpocEmail, getSrtEmails } from "libs/email/content/email-components";
import { htmlToText, HtmlToTextOptions } from "html-to-text";
import pLimit from "p-limit";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { getNamespace } from "libs/utils";

class TemporaryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TemporaryError";
  }
}

interface ProcessEmailConfig {
  emailAddressLookupSecretName: string;
  applicationEndpointUrl: string;
  osDomain: string;
  indexNamespace?: string;
  region: string;
  DLQ_URL: string;
  userPoolId: string;
  configurationSetName: string;
  isDev: boolean;
}

export const handler: Handler<KafkaEvent> = async (event) => {
  const requiredEnvVars = [
    "emailAddressLookupSecretName",
    "applicationEndpointUrl",
    "osDomain",
    "region",
    "DLQ_URL",
    "userPoolId",
    "configurationSetName",
    "isDev",
  ] as const;

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }

  const emailAddressLookupSecretName = process.env.emailAddressLookupSecretName!;
  const applicationEndpointUrl = process.env.applicationEndpointUrl!;
  const osDomain = process.env.osDomain!;
  const indexNamespace = process.env.indexNamespace;
  const region = process.env.region!;
  const DLQ_URL = process.env.DLQ_URL!;
  const userPoolId = process.env.userPoolId!;
  const configurationSetName = process.env.configurationSetName!;
  const isDev = process.env.isDev!;
  const config: ProcessEmailConfig = {
    emailAddressLookupSecretName,
    applicationEndpointUrl,
    osDomain: `https://${osDomain}`,
    indexNamespace,
    region,
    DLQ_URL,
    userPoolId,
    configurationSetName,
    isDev: isDev === "true",
  };

  console.log("config: ", JSON.stringify(config, null, 2));

  try {
    const results = await Promise.allSettled(
      Object.values(event.records)
        .flat()
        .map((rec) => processRecord(rec, config)),
    );

    console.log("results: ", JSON.stringify(results, null, 2));

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.error("Some records failed:", JSON.stringify(failures, null, 2));
      throw new TemporaryError("Some records failed processing");
    }
    console.log("All records processed successfully", JSON.stringify(failures, null, 2));
  } catch (error) {
    console.error("Permanent failure:", error);

    if (config.DLQ_URL) {
      const sqsClient = new SQSClient({ region: config.region });
      try {
        await sqsClient.send(
          new SendMessageCommand({
            QueueUrl: config.DLQ_URL,
            MessageBody: JSON.stringify({
              error: error.message,
              originalEvent: event,
              timestamp: new Date().toISOString(),
            }),
          }),
        );
        console.log("Failed message sent to DLQ");
      } catch (dlqError) {
        console.error("Failed to send to DLQ:", dlqError);
        throw dlqError;
      }
    }
    throw error;
  }
};

export async function processRecord(kafkaRecord: KafkaRecord, config: ProcessEmailConfig) {
  console.log('before process record')
  console.log("processRecord called with kafkaRecord: ", JSON.stringify(kafkaRecord, null, 2));
  const { key, value, timestamp } = kafkaRecord;
  const id: string = decodeBase64WithUtf8(key);
  console.log("start id", id)
  if (kafkaRecord.topic === "aws.seatool.ksql.onemac.three.agg.State_Plan") {
    console.log("1",decodeBase64WithUtf8(value))
    console.log("2",JSON.parse(decodeBase64WithUtf8(value)))
    const safeID = id.replace(/^"|"$/g, "")
        const seatoolRecord: Document = {
          safeID,
          ...JSON.parse(decodeBase64WithUtf8(value)),
        };
        console.log("beforeww")
        const safeSeatoolRecord = opensearch.main.seatool.transform(safeID).safeParse(seatoolRecord);
    console.log('inside process record', seatoolRecord)
    console.log('seatool safe record', safeSeatoolRecord)

    if(safeSeatoolRecord.data?.seatoolStatus === SEATOOL_STATUS.WITHDRAWN) {
      console.log(safeSeatoolRecord.data?.cmsStatus, "seatool status is withdrawn")
      
      console.log(safeSeatoolRecord, safeID, config)

      try {
      const item = await os.getItem(config.osDomain, getNamespace("main"), safeID);

      if (!item?.found || !item?._source) {
        console.log(`The package was not found for id: ${id} in mako. Doing nothing.`);
        return;
      }

      const recordToPass = {
        timestamp,
        ...safeSeatoolRecord,
        submitterName: item._source.submitterName,
        submitterEmail: item._source.submitterEmail
      }
      await processAndSendEmails(recordToPass, safeID, config);
      } catch (error) {
        console.error("Error processing record:", JSON.stringify(error, null, 2));
        throw error;
      }
        }
        return
  }



  if (typeof key !== "string") {
    console.log("key is not a string ", JSON.stringify(key, null, 2));
    throw new Error("Key is not a string");
  }

  if (!value) {
    console.log("Tombstone detected. Doing nothing for this event");
    return;
  }

  const record = {
    timestamp,
    ...JSON.parse(decodeBase64WithUtf8(value)),
  };
  console.log("record: ", JSON.stringify(record, null, 2));

  if (record.origin !== "mako") {
    console.log("Kafka event is not of mako origin. Doing nothing.");
    return;
  }

  try {
    console.log("Config:", JSON.stringify(config, null, 2));
    await processAndSendEmails(record, id, config);
  } catch (error) {
    console.error("Error processing record:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export function validateEmailTemplate(template: any) {
  const requiredFields = ["to", "subject", "body"];
  const missingFields = requiredFields.filter((field) => !template[field]);

  if (missingFields.length > 0) {
    throw new Error(`Email template missing required fields: ${missingFields.join(", ")}`);
  }
}

export async function processAndSendEmails(record: any, id: string, config: ProcessEmailConfig) {
  let templates; 
  if (record?.data?.seatoolStatus) {
    console.log('seatoollstatus in process emails', record.data.authority.toLowerCase())
    templates = await getEmailTemplates<typeof record>(
      "seatool-withdraw",
      record.data.authority.toLowerCase(),
    );
  } else {
    templates = await getEmailTemplates<typeof record>(
      record.event,
      record.authority.toLowerCase(),
    );
  }


  if (!templates) {
    console.log(
      `The kafka record has an event type that does not have email support.  event: ${record.event}.  Doing nothing.`,
    );
    return;
  }

  console.log('templates', templates)
  console.log("id:", id);
  const territory = id.slice(0, 2);
  console.log("territory", territory)
  const allStateUsers = await getAllStateUsers({
    userPoolId: config.userPoolId,
    state: territory,
  });
  console.log("all state",allStateUsers)

  const sec = await getSecret(config.emailAddressLookupSecretName);
  console.log('sec', sec)
  const item = await os.getItem(config.osDomain, getNamespace("main"), id);
  console.log("item", item);
  if (!item?.found || !item?._source) {
    console.log(`The package was not found for id: ${id}. Doing nothing.`);
    return;
  }
  // if status is withdrawn send it
  // seatool trx has multiple kafka event (cross that bridge if it does happen)
  console.log('before emails' )
  const cpocEmail = [...getCpocEmail(item)];
  const srtEmails = [...getSrtEmails(item)];

  const emails: EmailAddresses = JSON.parse(sec);

  const allStateUsersEmails = allStateUsers.map((user) => user.formattedEmailAddress);
  console.log('before template vars', )
  const templateVariables = {
    ...record,
    id,
    applicationEndpointUrl: config.applicationEndpointUrl,
    territory,
    emails: { ...emails, cpocEmail, srtEmails },
    allStateUsersEmails,
  };

  console.log("Template variables:", JSON.stringify(templateVariables, null, 2));
  const limit = pLimit(5); // Limit concurrent emails
  const sendEmailPromises = templates.map((template) =>
    limit(async () => {
      const filledTemplate = await template(templateVariables);
      validateEmailTemplate(filledTemplate);
      const params = createEmailParams(
        filledTemplate,
        emails.sourceEmail,
        config.applicationEndpointUrl,
        config.isDev,
      );
      try {
        await sendEmail(params, config.region);
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    }),
  );

  try {
    await Promise.all(sendEmailPromises);
  } catch (error) {
    console.error("Error sending emails:", error);
    throw error;
  }
}

export function createEmailParams(
  filledTemplate: any,
  sourceEmail: string,
  baseUrl: string,
  isDev: boolean,
): SendEmailCommandInput {
  console.log('filled template', filledTemplate)
  const params = {
    Destination: {
      ToAddresses: filledTemplate.to,
      CcAddresses: filledTemplate.cc,
      BccAddresses: isDev ? [`State Submitter <${EMAIL_CONFIG.DEV_EMAIL}>`] : [], // this is so emails can be tested in dev as they should have the correct recipients but be blind copied on all emails on dev
    },
    Message: {
      Body: {
        Html: { Data: filledTemplate.body, Charset: "UTF-8" },
        Text: {
          Data: htmlToText(filledTemplate.body, htmlToTextOptions(baseUrl)),
          Charset: "UTF-8",
        },
      },
      Subject: { Data: filledTemplate.subject, Charset: "UTF-8" },
    },
    Source: sourceEmail,
    ConfigurationSetName: process.env.configurationSetName,
  };
  console.log("Email params:", JSON.stringify(params, null, 2));
  return params;
}

export async function sendEmail(params: SendEmailCommandInput, region: string): Promise<any> {
  const sesClient = new SESClient({ region: region });
  console.log("sendEmail called with params:", JSON.stringify(params, null, 2));

  const command = new SendEmailCommand(params);
  try {
    const result = await sesClient.send(command);
    return { status: result.$metadata.httpStatusCode };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

const htmlToTextOptions = (baseUrl: string): HtmlToTextOptions => ({
  wordwrap: 80,
  preserveNewlines: true,
  selectors: [
    {
      selector: "h1",
      options: {
        uppercase: true,
        leadingLineBreaks: 2,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "img",
      options: {
        ignoreHref: true,
        src: true,
      },
    },
    {
      selector: "p",
      options: {
        leadingLineBreaks: 1,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "a",
      options: {
        linkBrackets: ["[", "]"],
        baseUrl,
        hideLinkHrefIfSameAsText: true,
      },
    },
  ],
  limits: {
    maxInputLength: 50000,
    ellipsis: "...",
    maxBaseElements: 1000,
  },
  longWordSplit: {
    forceWrapOnLimit: false,
    wrapCharacters: ["-", "/"],
  },
});
