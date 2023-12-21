import { z } from "zod";
import { onemacAttachmentSchema } from "../attachments";

// Temporary, will be refactored to an extendable schema with Brian/Mike's back-end
// work.
export const withdrawPackageSchema = z.object({
  id: z.string(),
  authority: z.string(),
  origin: z.string(),
  additionalInformation: z
    .string()
    .max(4000, "This field may only be up to 4000 characters.")
    .optional(),
  attachments: z.array(onemacAttachmentSchema),
  submitterName: z.string(),
  submitterEmail: z.string(),
});

export type WithdrawPackage = z.infer<typeof withdrawPackageSchema>;

export const transformWithdrawPackage = (id: string) => {
  // This does nothing.  Just putting the mechanics in place.
  return withdrawPackageSchema.transform((data) => ({
    id,
    raiWithdrawEnabled: null,
  }));
};
export type WithdrawPackageTransform = z.infer<
  ReturnType<typeof transformWithdrawPackage>
>;
