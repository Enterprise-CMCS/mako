import { decode } from "base-64";
import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    // UserType as CognitoUserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import {
    transformOnemac,
    transformOnemacLegacy,
    transformRaiIssue,
    transformRaiResponse,
    transformRaiWithdraw,
    transformWithdrawPackage,
    transformToggleWithdrawRaiEnabled,
    Action,
  } from "shared-types";

// import { CognitoUserAttributes } from "shared-types";

const SES = new SESClient({ region: process.env.region });
const Cognito = new CognitoIdentityProviderClient({
    region: process.env.region,
});

export const onemacDataTransform = (props) => {
    const id = decode(props.key);
  
    // is delete
    if (!props.value) {
      return {
        id,
        additionalInformation: null,
        raiWithdrawEnabled: null,
        attachments: null,
        submitterEmail: null,
        submitterName: null,
      };
    }
  
    const record = { id, ...JSON.parse(decode(props.value)) };
  
    // is Legacy
    const isLegacy = record?.origin !== "micro";
    if (isLegacy) {
      const notPackageView = record?.sk !== "Package";
      if (notPackageView) return null;
  
      const notOriginatingFromOnemacLegacy =
        !record.submitterName || record.submitterName === "-- --";
      if (notOriginatingFromOnemacLegacy) return null;
  
      const result = transformOnemacLegacy(id).safeParse(record);
      return result.success ? result.data : null;
    }
  
    // NOTE: Make official decision on initial type by MVP - timebomb
    const isNewRecord = !record?.actionType;
    if (isNewRecord) {
      const result = transformOnemac(id).safeParse(record);
      return result.success ? result.data : null;
    }
  
    // --------- Package-Actions ---------//
    // TODO: remove transform package-action below
  
    if (record.actionType === Action.ENABLE_RAI_WITHDRAW) {
      const result = transformToggleWithdrawRaiEnabled(id).safeParse(record);
      return result.success ? result.data : null;
    }
  
    if (record.actionType === Action.DISABLE_RAI_WITHDRAW) {
      const result = transformToggleWithdrawRaiEnabled(id).safeParse(record);
      return result.success ? result.data : null;
    }
  
    if (record.actionType === Action.ISSUE_RAI) {
      const result = transformRaiIssue(id).safeParse(record);
      return result.success ? result.data : null;
    }
  
    if (record.actionType === Action.RESPOND_TO_RAI) {
      const result = transformRaiResponse(id).safeParse(record);
      return result.success ? result.data : null;
    }
  
    if (record.actionType === Action.WITHDRAW_RAI) {
      const result = transformRaiWithdraw(id).safeParse(record);
      return result.success ? result.data : null;
    }
  
    if (record.actionType === Action.WITHDRAW_PACKAGE) {
      const result = transformWithdrawPackage(id).safeParse(record);
      return result.success ? result.data : null;
    }
  
    return null;
  };

const createSendEmailCommand = (event) =>
    new SendEmailCommand({
        Source: "kgrue@fearless.tech",
        Destination: {
            ToAddresses: [
                "k.grue.stateuser@gmail.com",
            ],
        },
        Message: {
            Subject: {
                Data: event.subject ?? "Subject Required",
                Charset: "UTF-8",
            },
            Body: {
                Text: {
                    Data: "Body Text",
                    Charset: "UTF-8",
                },
                Html: {
                    Data: "<p>HTML body text</p><p>yup</p>",
                    Charset: "UTF-8",
                },
            },
        },
        ConfigurationSetName: process.env.emailConfigSet,
    });

export const main = async (event, context, callback) => {
    let response;
    console.log("Received event (stringified):", JSON.stringify(event, null, 4));

    const records = Object.values(event.records).reduce((ACC, RECORDS) => {
        RECORDS.forEach((REC) => {
          const dataTransform = onemacDataTransform(REC);
          if (!dataTransform) return;
          ACC.push(dataTransform);
        });
    
        return ACC;
      }, []);

    console.log("the transformed records are: ", records);
    
    const commandListUsers = new ListUsersCommand({
        UserPoolId: process.env.cognitoPoolId,
    });

    const sendEmailCommand = createSendEmailCommand(event);

    try {
        const listUsersResponse = await Cognito.send(commandListUsers);
        console.log("listUsers response: ", JSON.stringify(listUsersResponse, null, 4));

        response = await SES.send(sendEmailCommand);
        console.log("sendEmailCommand response: ", JSON.stringify(response, null, 4));
    } catch (err) {
        console.log("Failed to process emails.", err);
    }
    callback(null, "Success");
};
