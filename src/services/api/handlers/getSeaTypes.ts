import { APIGatewayEvent } from "aws-lambda";
import * as os from "./../../../libs/opensearch-lib";
import { response } from "../libs/handler";
import { opensearch } from "shared-types";

type GetSeaTypeBody = {
  authorityId: string;
};

export const getAllSeaTypes = async (authorityId: string) => {
  if (!process.env.osDomain) {
    throw new Error("process.env.osDomain must be defined");
  }

  return (await os.search(process.env.osDomain, "types", {
    query: {
      bool: {
        must: [
          {
            match: {
              authorityId: authorityId,
            },
          },
        ],
        must_not: [
          {
            match_phrase: {
              name: {
                query: "Do Not Use",
              },
            },
          },
        ],
      },
    },
  })) as opensearch.types.Response;
};

export const getSeaTypes = async (event: APIGatewayEvent) => {
  if (!event.body) {
    return response({
      statusCode: 400,
      body: { message: "Event body required" },
    });
  }
  const body = JSON.parse(event.body) as GetSeaTypeBody;
  try {
    const result = await getAllSeaTypes(body.authorityId);

    if (!result)
      return response({
        statusCode: 400,
        body: { message: "No record found for the given authority" },
      });

    return response({
      statusCode: 200,
      body: {
        seaTypes: result,
      },
    });
  } catch (err) {
    console.error({ err });
    return response({
      statusCode: 500,
      body: { message: "Internal server error" },
    });
  }
};
export const handler = getSeaTypes;
