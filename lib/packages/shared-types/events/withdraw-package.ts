import { z } from "zod";
import {
  attachmentSchema,
  attachmentArraySchemaOptional,
  attachmentArraySchema,
} from "../attachments";

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
  attachments: z.array(attachmentSchema).nullish(),
  submitterName: z.string(),
  submitterEmail: z.string(),
  timestamp: z.number().optional(),
});

export type WithdrawPackage = z.infer<typeof withdrawPackageSchema>;

export const attachmentsDefault = z.object({
  supportingDocumentation: z.object({
    files: attachmentArraySchemaOptional(),
    label: z.string().default("Supporting Documentation"),
  }),
});
export const attachmentsChip = z.object({
  officialWithdrawalLetter: z.object({
    files: attachmentArraySchema(),
    label: z.string().default("Official Withdrawal Letter"),
  }),
});

export const baseSchema = z.object({
  event: z.literal("withdraw-package").default("withdraw-package"),
  id: z.string(),
  authority: z.string(),
  additionalInformation: z.string().max(4000),
  attachments: attachmentsDefault.or(attachmentsChip),
});

export const schema = baseSchema.extend({
  origin: z.literal("mako").default("mako"),
  submitterName: z.string(),
  submitterEmail: z.string().email(),
  timestamp: z.number(),
});

// export type RaiWithdraw = z.infer<typeof baseSchema>;
