import { withdrawPackageSchema } from "../../..";

export const transform = (id: string) => {
  // This does nothing.  Just putting the mechanics in place.
  return withdrawPackageSchema.transform((data) => ({
    id,
    raiWithdrawEnabled: false,
    makoChangedDate: new Date(data.timestamp).toISOString(),
  }));
};

export type Schema = ReturnType<typeof transform>;
