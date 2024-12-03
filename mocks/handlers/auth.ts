import { CognitoUserAttributes } from "shared-types";
import { isCmsUser } from "shared-utils";
import {
  CognitoUserResponse,
  makoReviewer,
  makoStateSubmitter,
  userResponses,
} from "../data/users";

export const setMockUsername = (user?: string | CognitoUserResponse | null): void => {
  if (user) {
    if (typeof user === "string") {
      process.env.MOCK_USER_USERNAME = user;
    } else {
      process.env.MOCK_USER_USERNAME = user.Username;
    }
  } else {
    delete process.env.MOCK_USER_USERNAME;
  }
};

export const useDefaultStateSubmitter = () => setMockUsername(makoStateSubmitter);

export const useDefaultReviewer = () => setMockUsername(makoReviewer);

export const mockCurrentAuthenticatedUser = async () => {
  if (process.env.MOCK_USER_USERNAME) {
    const user = findUserByUsername(process.env.MOCK_USER_USERNAME);
    if (user) {
      return {
        username: user.Username,
        attributes: user.UserAttributes,
        preferredMFA: "NOMFA",
      };
    }
    return undefined;
  }
  return undefined;
};

export const mockUserAttributes = async (currentAuthenticatedUser: any) => {
  if (currentAuthenticatedUser?.currentAuthenticatedUser?.attributes) {
    return currentAuthenticatedUser.currentAuthenticatedUser.attributes;
  }
  if (process.env.MOCK_USER_USERNAME) {
    const user = findUserByUsername(process.env.MOCK_USER_USERNAME);
    if (user) {
      return user.UserAttributes;
    }
  }
  return undefined;
};

export const mockUseGetUser = () => {
  if (process.env.MOCK_USER_USERNAME) {
    const user = findUserByUsername(process.env.MOCK_USER_USERNAME);
    if (user) {
      // Set object up with key/values from attributes array
      const userAttributesObj = user?.UserAttributes?.reduce(
        (obj, item) =>
          item?.Name && item?.Value
            ? {
                ...obj,
                [item.Name]: item.Value,
              }
            : obj,
        {} as CognitoUserAttributes,
      );
      // Manual additions and normalizations
      userAttributesObj["custom:cms-roles"] = userAttributesObj?.["custom:cms-roles"] || "";

      userAttributesObj.username = user?.Username || "";

      return {
        data: {
          user: userAttributesObj,
          isCms: isCmsUser(userAttributesObj),
        },
        isLoading: false,
        isSuccess: true,
      };
    }
  }
  return {
    data: null,
    isLoading: false,
    isSuccess: true,
  };
};

const findUserByUsername = (username: string): CognitoUserResponse | undefined =>
  userResponses.find((user) => user.Username == username);
