import { z } from "zod";
import { zAdditionalInfo, zAttachmentOptional } from "@/utils";
import { FormContentHydrator } from "@/features/package-actions/lib/contentSwitch";
import { ReactElement } from "react";
import {
  ActionDescription,
  AdditionalInfoSection,
  AttachmentsSection,
} from "@/components";
import { PackageSection } from "@/features/package-actions/shared-components";

export * from "./spa/withdraw-chip-rai";

export const defaultWithdrawPackageSchema = z
  .object({
    additionalInformation: zAdditionalInfo.optional(),
    attachments: z.object({
      supportingDocumentation: zAttachmentOptional,
    }),
  })
  .superRefine((data, ctx) => {
    if (
      !data.attachments.supportingDocumentation?.length &&
      data.additionalInformation === undefined
    ) {
      ctx.addIssue({
        message: "An Attachment or Additional Information is required.",
        code: z.ZodIssueCode.custom,
        fatal: true,
      });
      // Zod says this is to appease types
      // https://github.com/colinhacks/zod?tab=readme-ov-file#type-refinements
      return z.NEVER;
    }
  });
export const defaultWithdrawPackageFields: ReactElement[] = [
  <ActionDescription key={"content-description"}>
    Complete this form to withdraw a package. Once complete, you will not be
    able to resubmit this package. CMS will be notified and will use this
    content to review your request. If CMS needs any additional information,
    they will follow up by email.
  </ActionDescription>,
  <PackageSection key={"content-packagedetails"} />,
  <AttachmentsSection
    key={"field-attachments"}
    instructions={
      "Upload your supporting documentation for withdrawal or explain your need for withdrawal in the Additional Information section."
    }
    attachments={[
      {
        name: "supportingDocumentation",
        label: "Supporting Documentation",
        required: false,
      },
    ]}
    faqLink={""}
  />,
  <AdditionalInfoSection
    key={"field-addlinfo"}
    instruction={
      "Explain your need for withdrawal, or upload supporting documentation."
    }
  />,
];
export const defaultWithdrawPackageContent: FormContentHydrator = (
  document,
) => ({
  title: `Withdraw ${document.authority} Package`,
  preSubmitNotice:
    "Once complete, you will not be able to resubmit this package. CMS will be notified and will use this content to review your request. If CMS needs any additional information, they will follow up by email.",
  confirmationModal: {
    header: "Withdraw Package?",
    body: `The package ${document.id} will be withdrawn.`,
    acceptButtonText: "Yes, withdraw package",
    cancelButtonText: "Return to form",
  },
  successBanner: {
    header: "Package withdrawn",
    body: `The package ${document.id} has been withdrawn.`,
  },
});
