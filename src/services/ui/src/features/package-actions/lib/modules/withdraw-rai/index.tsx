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

export const defaultWithdrawRaiSchema = z.object({
  additionalInformation: zAdditionalInfo,
  attachments: z.object({
    supportingDocumentation: zAttachmentOptional,
  }),
});
export const defaultWithdrawRaiFields: ReactElement[] = [
  <ActionFormDescription key={"content-description"}>
    Complete this form to withdraw the Formal RAI response. Once complete, you
    and CMS will receive an email confirmation.
  </ActionFormDescription>,
  <PackageSection key={"content-packagedetails"} />,
  <AttachmentsSection
    key={"field-attachments"}
    attachments={[
      {
        name: "supportingDocumentation",
        required: false,
      },
    ]}
    faqLink={""}
  />,
  <AdditionalInfoSection
    required
    key={"field-addlinfo"}
    instruction={
      "Add anything else that you would like to share with the State."
    }
  />,
];
export const defaultWithdrawRaiContent: FormContentHydrator = (document) => ({
  title: `${document.authority} Withdraw Formal RAI Response Details`,
  preSubmitNotice:
    "Once complete, you and CMS will receive an email confirmation.",
  confirmationModal: {
    header: "Withdraw RAI response?",
    body: `The RAI response for ${document.id} will be withdrawn, and CMS will be notified.`,
    acceptButtonText: "Yes, withdraw response",
    cancelButtonText: "Cancel",
  },
  successBanner: {
    header: "RAI response withdrawn",
    body: `The RAI response for ${document.id} has been withdrawn. CMS may follow up if additional information is needed.`,
  },
});
