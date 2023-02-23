import type { APIGatewayEvent } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

export const handler = middy(async ({ pathParameters }: APIGatewayEvent) => {
  const { id } = pathParameters;

  return {
    statusCode: 200,
    body: JSON.stringify({ id }),
  };
}).use(cors());
