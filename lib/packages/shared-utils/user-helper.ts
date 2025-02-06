import { CognitoUserAttributes, STATE_ROLES, UserRoles } from "shared-types";

/** Function receives a user's cognito attributes and list of authorized roles,
 * and will confirm the user has one or more authorized UserRoles */
const userHasAuthorizedRole = (user: CognitoUserAttributes | null, authorized: UserRoles[]) => {
  if (!user) return false;
  const userRoles = user["custom:cms-roles"].split(",") as UserRoles[];
  return userRoles.filter((role) => authorized.includes(role)).length > 0;
};

const isCmsUser = (user: CognitoUserAttributes | null) => {
  if (!user) return false;
  const userRoles = user["custom:ismemberof"];

  return userRoles.includes("ONEMAC_USER_");
};
/** Confirms user is a CMS user who can create data LOGIC NOT ADDED YET */
export const isCmsWriteUser = (user: CognitoUserAttributes | null) => isCmsUser(user);
/** Confirms user is a CMS user who can only view data LOGIC NOT ADDED YET */
export const isCmsReadonlyUser = (user: CognitoUserAttributes | null) => isCmsUser(user);
/** Confirms user is a State user */
export const isStateUser = (user: CognitoUserAttributes | null) =>
  userHasAuthorizedRole(user, STATE_ROLES);
/** Confirms user is a State user */
export const isCmsSuperUser = (user: CognitoUserAttributes | null) => isCmsUser(user);
/** Confirms user is an IDM user */
export const isIDM = (user: CognitoUserAttributes | null) => user?.username.startsWith("IDM_");
