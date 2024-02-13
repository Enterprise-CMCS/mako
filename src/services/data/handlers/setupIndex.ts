import { Handler } from "aws-lambda";
import * as os from "./../../../libs/opensearch-lib";
import { opensearch } from "shared-types";
import { Index } from "shared-types/opensearch";

export const handler: Handler = async (
  _,
  __,
  callback
) => {
  const response = {
    statusCode: 200,
  };
  let errorResponse = null;
  try {
    const indices = ["main", "changelog", "seatool", "types", "subtypes"]
    for (const index of indices) {
      await manageIndexResource({ index: index as Index});
    }
  } catch (error: any) {
    response.statusCode = 500;
    errorResponse = error;
  } finally {
    callback(errorResponse, response);
  }
};

const manageIndexResource = async (resource: {
  index: opensearch.Index;
  update?: object;
}) => {
  if (!process.env.osDomain) {
    throw new Error("process.env.osDomain must be defined");
  }

  const createIndex = await os.createIndex(
    process.env.osDomain,
    resource.index
  );
  console.log(createIndex);

  if (!resource.update) return;

  const updateFieldMapping = await os.updateFieldMapping(
    process.env.osDomain,
    resource.index,
    resource.update
  );
  console.log(updateFieldMapping);
};
