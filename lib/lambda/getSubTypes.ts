import { handleOpensearchError } from "./utils"; 
import { APIGatewayEvent } from "aws-lambda";
import { response } from "../libs/handler-lib";
import * as os from "../libs/opensearch-lib";

type GetSubTypesBody = {
  authorityId: string;
  typeIds: string[];
};

export const querySubTypes = async (authorityId: string, typeIds: string[]) => {
  if (!process.env.osDomain) {
    throw new Error("process.env.osDomain must be defined");
  }

  const query = {
    size: 200,
    query: {
      bool: {
        must: [
          {
            match: {
              authorityId: authorityId,
            },
          },
          {
            terms: {
              typeId: typeIds,
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
    sort: [
      {
        "name.keyword": {
          order: "asc",
        },
      },
    ],
  };

  return await os.search(process.env.osDomain, `${process.env.indexNamespace}subtypes`, query);
};

export const getSubTypes = async (event: APIGatewayEvent) => {
  if (!event.body) {
    return response({
      statusCode: 400,
      body: { message: "Event body required" },
    });
  }
  const body = JSON.parse(event.body) as GetSubTypesBody;
  try {
    const result = await querySubTypes(body.authorityId, body.typeIds);

    if (!result)
      return response({
        statusCode: 400,
        body: { message: "No record found for the given authority" },
      });

    return response({
      statusCode: 200,
      body: result,
    });
  } catch (err) {
    return response(handleOpensearchError(err))
  }
};

export const handler = getSubTypes;
