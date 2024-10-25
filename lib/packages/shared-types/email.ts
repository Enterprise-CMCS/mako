export type EmailAddresses = {
  osgEmail: string[];
  dpoEmail: string[];
  dmcoEmail: string[];
  dhcbsooEmail: string[];
  chipInbox: string[];
  chipCcList: string[];
  sourceEmail: string;
  srtEmails: string[];
  cpocEmail: string[];
};

export interface CommonEmailVariables {
  id: string;
  territory: string;
  applicationEndpointUrl: string;
  actionType: string;
  allStateUsersEmails?: string[];
}