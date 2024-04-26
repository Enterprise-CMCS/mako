import { z } from "zod";
import { zAdditionalInfo, zAttachmentOptional } from "@/utils";
import { FormContentHydrator } from "@/features/package-actions/lib/contentSwitch";
import { ReactElement } from "react";
import {
  ActionFormDescription,
  AdditionalInfoSection,
  AttachmentsSection,
  PackageSection,
} from "@/components";

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
  <ActionFormDescription key={"content-description"}>
    Complete this form to withdraw a package. Once complete, you will not be
    able to resubmit this package. CMS will be notified and will use this
    content to review your request. If CMS needs any additional information,
    they will follow up by email.
  </ActionFormDescription>,
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
  title: `Withdraw ${document.authority}`,
  preSubmitNotice:
    "Once complete, you will not be able to resubmit this package. CMS will be notified and will use this content to review your request. If CMS needs any additional information, they will follow up by email.",
  confirmationModal: document?.appkParent
    ? {
        header: "Are you sure you want to withdraw this package?",
        body: `All packages associated with ${document.id} will also be withdrawn.`,
        acceptButtonText: "Yes, withdraw",
        cancelButtonText: "Cancel",
      }
    : {
        header: "Withdraw Package?",
        body: `You are about to withdraw ${document.authority} ${document.id}. Completing this action will conclude the review of this ${document.authority} package. If you are not sure this is the correct action to select, contact your CMS point of contact for assistance`,
        acceptButtonText: "Yes, withdraw package",
        cancelButtonText: "Return to form",
      },
  successBanner: {
    header: "Package withdrawn",
    body: `The package ${document.id} has been withdrawn.`,
  },
});
