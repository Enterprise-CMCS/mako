import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UserType as CognitoUserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoUserAttributes } from "shared-types";
import { APIGatewayEvent } from "aws-lambda";

// Retrieve user authentication details from the APIGatewayEvent
export function getAuthDetails(event: APIGatewayEvent) {
  const authProvider =
    event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(":");
  const userPoolIdParts = parts[parts.length - 3].split("/");
  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  const userPoolUserId = parts[parts.length - 1];

  return { userId: userPoolUserId, poolId: userPoolId };
}

// Convert Cognito user attributes to a dictionary format
function userAttrDict(cognitoUser: CognitoUserType): CognitoUserAttributes {
  const attributes = {};

  if (cognitoUser.Attributes) {
    cognitoUser.Attributes.forEach((attribute) => {
      if (attribute.Value && attribute.Name) {
        attributes[attribute.Name] = attribute.Value;
      }
    });
  }

  return attributes as CognitoUserAttributes;
}

// Parse object values as JSON if possible
export const getParsedObject = (obj: CognitoUserAttributes) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      try {
        return [key, JSON.parse(value)];
      } catch (error) {
        return [key, value];
      }
    })
  );

// Retrieve and parse user attributes from Cognito using the provided userId and poolId
export async function lookupUserAttributes(
  userId: string,
  poolId: string
): Promise<CognitoUserAttributes> {
  const fetchResult = await fetchUserFromCognito(userId, poolId);

  if (fetchResult instanceof Error) {
    throw fetchResult;
  }

  const currentUser = fetchResult as CognitoUserType;
  const attributes = userAttrDict(currentUser);

  return getParsedObject(attributes) as CognitoUserAttributes;
}

// Fetch user data from Cognito based on the provided userId and poolId
async function fetchUserFromCognito(
  userID: string,
  poolID: string
): Promise<CognitoUserType | Error> {
  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.region,
  });

  const subFilter = `sub = "${userID}"`;

  const commandListUsers = new ListUsersCommand({
    UserPoolId: poolID,
    Filter: subFilter,
  });

  try {
    const listUsersResponse = await cognitoClient.send(commandListUsers);

    if (
      listUsersResponse.Users === undefined ||
      listUsersResponse.Users.length !== 1
    ) {
      throw new Error("No user found with this sub");
    }

    const currentUser = listUsersResponse.Users[0];
    return currentUser;
  } catch (error) {
    throw new Error("Error fetching user from Cognito");
  }
}
