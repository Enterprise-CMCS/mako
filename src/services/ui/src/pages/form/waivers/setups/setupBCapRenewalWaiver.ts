import { z } from "zod";
import {
  zAdditionalInfo,
  zAttachmentOptional,
  zAttachmentRequired,
} from "@/pages/form/zod";
import { FormSetup } from "@/lib";

export default {
  schema: z.object({
    attachments: z.object({
      b4WaiverApplication: zAttachmentRequired({ min: 1 }),
      bCapCostSpreadsheets: zAttachmentRequired({ min: 1 }),
      bCapIndependentAssessment: zAttachmentOptional, // TODO: Make required ONLY for first 2 renewals
      tribalConsultation: zAttachmentOptional,
      other: zAttachmentOptional,
    }),
    additionalInformation: zAdditionalInfo,
  }),
  attachments: [
    {
      name: "bCapWaiverApplication",
      label: "1915(b) Comprehensive (Capitated) Waiver Application Pre-print",
      required: true,
    },
    {
      name: "bCapCostSpreadsheets",
      label:
        "1915(b) Comprehensive (Capitated) Waiver Cost Effectiveness Spreadsheets",
      required: true,
    },
    {
      name: "bCapIndependentAssessment",
      label: "1915(b) Comprehensive (Capitated) Waiver Independent Assessment",
      // TODO: Visually communicate required ONLY for first 2 renewals...somehow
      required: false,
    },
    {
      name: "tribalConsultation",
      label: "Tribal Consultation",
      required: false,
    },
    {
      name: "other",
      label: "Other",
      required: false,
    },
  ],
} as FormSetup;
