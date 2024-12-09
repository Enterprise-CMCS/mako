import { canBeRenewedOrAmended, idIsApproved, itemExists } from "@/api";
import { isAuthorizedState } from "@/utils";
import { events } from "shared-types/events";

export const formSchema = events["capitated-renewal"].baseSchema.extend({
  id: events["capitated-renewal"].baseSchema.shape.id
    .refine(isAuthorizedState, {
      message:
        "You can only submit for a state you have access to. If you need to add another state, visit your IDM user profile to request access.",
    })
    .refine(async (value) => !(await itemExists(value)), {
      message:
        "According to our records, this 1915(b) Waiver Number already exists. Please check the 1915(b) Waiver Number and try entering it again.",
    }),
  waiverNumber: events["capitated-renewal"].baseSchema.shape.waiverNumber
    .refine(async (value) => await itemExists(value), {
      message:
        "According to our records, this 1915(b) Waiver Number does not yet exist. Please check the 1915(b) Initial or Renewal Waiver Number and try entering it again.",
    })
    .refine(async (value) => canBeRenewedOrAmended(value), {
      message:
        "The 1915(b) Waiver Number entered does not seem to match our records. Please enter an approved 1915(b) Initial or Renewal Waiver Number, using a dash after the two character state abbreviation.",
    })
    .refine(async (value) => idIsApproved(value), {
      message:
        "According to our records, this 1915(b) Waiver Number is not approved. You must supply an approved 1915(b) Initial or Renewal Waiver Number.",
    }),
});
