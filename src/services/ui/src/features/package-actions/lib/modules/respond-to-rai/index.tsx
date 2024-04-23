import { FormContentHydrator } from "@/features/package-actions/lib/contentSwitch";

export * from "./spa/med-rai";
export * from "./spa/chip-rai";
export const spaRaiContent: FormContentHydrator = (document) => ({
  title: `${document.authority} Formal RAI Response Details`,
  preSubmitNotice:
    "Once you submit this form, a confirmation email is sent to you and to CMS. CMS will use this content to review your package, and you will not be able to edit this form. If CMS needs any additional information, they will follow up by email.",
  successBanner: {
    header: "RAI response submitted",
    body: `The RAI response for ${document.id} has been submitted.`,
  },
});

export * from "./waiver/b-waiver-rai";
// TODO: C waiver rai??
export const waiverRaiContent: FormContentHydrator = (document) => ({
  title: `${document.authority} Waiver Formal RAI Response Details`,
  preSubmitNotice:
    "Once you submit this form, a confirmation email is sent to you and to CMS. CMS will use this content to review your package, and you will not be able to edit this form. If CMS needs any additional information, they will follow up by email.",
  successBanner: {
    header: "RAI response submitted",
    body: `The RAI response for ${document.id} has been submitted.`,
  },
});