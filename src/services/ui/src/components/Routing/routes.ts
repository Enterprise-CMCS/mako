export const ACTION = "/action/:id/:type";
export const HOME = "/";
export const DASHBOARD = "/dashboard";
export const DETAILS = "/details";
export const FAQ = "/faq";
export const PROFILE = "/profile";
// New Submission Routes
// Can stand to be reduced with dynamic segments (KH)
export const NEW_SUBMISSION_OPTIONS = "/new-submission";
export const SPA_SUBMISSION_OPTIONS = "/new-submission/spa";
export const MEDICAID_SPA_SUB_OPTIONS = "/new-submission/spa/medicaid";
export const CHIP_SPA_SUB_OPTIONS = "/new-submission/spa/chip";
export const WAIVER_SUBMISSION_OPTIONS = "/new-submission/waiver";
export const B_WAIVER_SUBMISSION_OPTIONS = "/new-submission/waiver/b";
export const B4_WAIVER_OPTIONS = "/new-submission/waiver/b/b4";
export const BCAP_WAIVER_OPTIONS = "/new-submission/waiver/b/capitated";
export const MEDICAID_ABP_LANDING =
  "/new-submission/spa/medicaid/landing/medicaid-abp";
export const MEDICAID_ELIGIBILITY_LANDING =
  "/new-submission/spa/medicaid/landing/medicaid-eligibility";
export const CHIP_ELIGIBILITY_LANDING =
  "/new-submission/spa/chip/landing/chip-eligibility";
export const CREATE = "/create";
export const MEDICAID_NEW = "/new-submission/spa/medicaid/create";
export const CHIP_NEW = "/new-submission/spa/chip/create";
export const B4_NEW = "/new-submission/waiver/b/b4/initial/create";
export const B4_RENEWAL = "/new-submission/waiver/b/b4/renewal/create";
export const B4_AMENDMENT = "/new-submission/waiver/b/b4/amendment/create";
export const BCAP_NEW = "/new-submission/waiver/b/capitated/initial/create";
export const BCAP_RENEWAL = "/new-submission/waiver/b/capitated/renewal/create";
export const BCAP_AMENDMENT =
  "/new-submission/waiver/b/capitated/amendment/create";
export const WEBFORMS = "/webforms";
export const WEBFORM = "/webform/:id/:version";
export const GUIDES = "/guides";
export const ABPGUIDE = "/guides/abp";
