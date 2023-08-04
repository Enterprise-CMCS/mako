import { response } from "../libs/handler";
import { APIGatewayEvent } from "aws-lambda";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as os from "./../../../libs/opensearch-lib";
import { isAuthorized } from "../libs/auth/user";
if (!process.env.osDomain) {
  throw "ERROR:  osDomain env variable is required,";
}

// Handler function to get Seatool data
export const handler = async (event: APIGatewayEvent) => {
  try {
    const body = JSON.parse(event.body);

    const query = {
      query: {
        bool: {
          must: [
            {
              match: {
                _id: body.id,
              },
            },
          ],
        },
      },
    };

    const results = await os.search(process.env.osDomain, "main", query);

    if (!results) {
      return response({
        statusCode: 404,
        body: { message: "No record found for the given id" },
      });
    }

    const stateCode = results.hits[0]._source.state;

    if (isAuthorized(event, stateCode)) {
      if (
        !results.hits[0]._source.attachments.some((e) => {
          return e.bucket === body.bucket && e.key === body.key;
        })
      ) {
        return response({
          statusCode: 500,
          body: {
            message: "Attachment details not found for given record id.",
          },
        });
      }

      // Now we can generate the presigned url
      const url = await generatePresignedS3Url(body.bucket, body.key, 60);

      return response<unknown>({
        statusCode: 200,
        body: { url },
      });
    } else {
      return response({
        statusCode: 403,
        body: { message: "User is not authorized to access this resource" },
      });
    }
  } catch (error) {
    console.error({ error });
    return response({
      statusCode: 500,
      body: { message: "Internal server error" },
    });
  }
};

async function generatePresignedS3Url(bucket, key, expirationInSeconds) {
  // Create an S3 client
  const roleToAssumeArn = process.env.onemacLegacyS3AccessRoleArn;

  // Create an STS client to make the AssumeRole API call
  const stsClient = new STSClient({});

  // Assume the role
  const assumedRoleResponse = await stsClient.send(
    new AssumeRoleCommand({
      RoleArn: roleToAssumeArn,
      RoleSessionName: "AssumedRoleSession",
    })
  );

  // Extract the assumed role credentials
  const assumedCredentials = assumedRoleResponse.Credentials;

  // Create S3 client using the assumed role's credentials
  const assumedS3Client = new S3Client({
    credentials: {
      accessKeyId: assumedCredentials.AccessKeyId,
      secretAccessKey: assumedCredentials.SecretAccessKey,
      sessionToken: assumedCredentials.SessionToken,
    },
  });

  // Create a command to get the object (you can adjust this according to your use case)
  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  // Generate a presigned URL
  const presignedUrl = await getSignedUrl(assumedS3Client, getObjectCommand, {
    expiresIn: expirationInSeconds,
  });

  return presignedUrl;
}
