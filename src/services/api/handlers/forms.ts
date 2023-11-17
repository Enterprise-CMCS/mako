import { response } from "../libs/handler";

import * as fs from "fs";
import { APIGatewayEvent } from "aws-lambda";

export const forms = async (event: APIGatewayEvent) => {
  try {
    const formId = event.queryStringParameters.formId;
    let formVersion = event.queryStringParameters.formVersion;

    if (!formId) {
      return response({
        statusCode: 400,
        body: JSON.stringify({ error: "File ID was not provided" }),
      });
    }

    const filePath = getFilepathForIdAndVersion(formId, formVersion);
    const jsonData = await fs.promises.readFile(filePath, "utf-8");
    console.log(jsonData);
    if (!jsonData) {
      return response({
        statusCode: 404,
        body: JSON.stringify({
          error: "No file was found with provided formId and formVersion",
        }),
      });
    }

    let form;
    try {
      if (!formVersion) formVersion = getMaxVersion(formId);

      const module = await import(`/opt/${formId}/v${formVersion}.js`);
      console.log(module);
      console.log(module[formId]);
      form = module[formId];
    } catch (importError) {
      console.error("Error importing module:", importError);
    }

    return response({
      statusCode: 200,
      body: form,
    });
  } catch (error) {
    console.error("Error:", error);
    return response({
      statusCode: 500,
      body: JSON.stringify({
        error: error.message ? error.message : "Internal server error",
      }),
    });
  }
};

export function getMaxVersion(formId: string) {
  const files = fs.readdirSync(`/opt/${formId}`);
  if (!files) return undefined;
  const versionNumbers = files?.map((fileName: string) => {
    const match = fileName.match(/^v(\d+)\./);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 1;
  });
  return Math.max(...versionNumbers).toString();
}

export function getFilepathForIdAndVersion(
  formId: string,
  formVersion: string | undefined
): string | undefined {
  if (formId && formVersion) {
    return `/opt/${formId}/v${formVersion}.js`;
  }

  const maxVersion = getMaxVersion(formId);

  if (!maxVersion) return undefined;
  return `/opt/${formId}/v${maxVersion}.js`;
}

export const handler = forms;
