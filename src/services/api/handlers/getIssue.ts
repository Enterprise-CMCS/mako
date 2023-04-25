import { z, ZodError } from "zod";
import { response } from "../libs/handler";
import { IssueService } from "../services/issueService";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoInstance = new DynamoDBClient({ region: process.env.region });

export const getIssue = async ({ pathParameters }) => {
  try {
    const validParams = z.object({
      id: z.string().uuid(),
    });

    const params = validParams.parse(pathParameters);

    const foundIssue = await new IssueService(dynamoInstance).getIssue({
      id: params.id,
      tableName: process.env.tableName,
    });

    return response({
      statusCode: 200,
      body: foundIssue,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return response({
        statusCode: 404,
        body: { message: error },
      });
    }

    return response({
      statusCode: 404,
      body: { message: "Issue not found" },
    });
  }
};

export const handler = getIssue;
