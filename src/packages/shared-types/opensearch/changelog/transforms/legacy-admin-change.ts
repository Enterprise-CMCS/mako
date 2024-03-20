import { legacyAdminChange, Action } from "../../..";

export const transform = (id: string) => {
  return legacyAdminChange.transform((data) => {
    // If we're still here, go ahead and transform the data
    if (
      data.changeMade.includes("Package not originally submitted in OneMAC")
    ) {
      console.log(
        "This is a NOSO that will be captured by the legacyEvent transform.  Doing nothing...",
      );
      return undefined;
    }
    const transformedData = {
      // Append only changelog, so we add the offset to make the document id unique
      // Legacy emits can emit multiple events for the same business event, so we key off the timestamp, not the offset, to prevent duplciates
      // Also:  nee these blank strings to not get a type error in the admin changes ui section
      // This (and all legacy events) should truly be its own index, this data is different and should be isolated.
      id: `${id}-legacy-admin-change${data.changeTimestamp}`,
      packageId: id,
      timestamp: data.changeTimestamp,
      actionType: Action.LEGACY_MANUAL_UPDATE,
      attachments: "",
      changeMade: data.changeMade,
      additionalInformation: "",
      submitterEmail: "",
      submitterName: "",
    };
    return transformedData;
  });
};

export type Schema = ReturnType<typeof transform>;
