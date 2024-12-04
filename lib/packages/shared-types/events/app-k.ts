import { z } from "zod";
import { attachmentArraySchema } from "../attachments";

export const baseSchema = z.object({
  id: z
    .string()
    .min(1, { message: "Required" })
    .refine((id) => /^[A-Z]{2}-\d{4,5}\.R\d{2}\.(?!00)\d{2}$/.test(id), {
      message:
        "The 1915(c) Waiver Amendment Number must be in the format of SS-####.R##.## or SS-#####.R##.##. For amendments, the last two digits start with '01' and ascends.",
    }),
  event: z.literal("app-k").default("app-k"),
  authority: z.string().default("1915(c)"),
  proposedEffectiveDate: z.number(),
  title: z.string().trim().min(1, { message: "Required" }).max(125),
  attachments: z.object({
    appk: z.object({
      label: z.string().default("Appendix K Template"),
      files: attachmentArraySchema({ max: 1 }),
    }),
    other: z.object({
      label: z.string().default("Other"),
      files: attachmentArraySchema({ max: 1 }),
    }),
  }),
  additionalInformation: z.string().max(4000).nullable().default(null).optional(),
});

export const schema = baseSchema.extend({
  actionType: z.string().default("Amend"),
  origin: z.literal("mako").default("mako"),
  submitterName: z.string(),
  submitterEmail: z.string().email(),
  timestamp: z.number(),
  deleted: z.boolean().default(false),
});
