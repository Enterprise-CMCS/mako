import { OsMainSourceItem } from "./opensearch";
import { ActionAvailabilityCheck } from "./actions";

export enum PlanType {
  MED_SPA = "medicaid spa",
  CHIP_SPA = "chip spa",
}

const checkPlan = (planType: PlanType | null, validPlanTypes: PlanType[]) =>
  !planType
    ? false
    : validPlanTypes.includes(planType.toLowerCase() as PlanType);

export const PlanCheck = (planType: PlanType | null) => ({
  isSpa: checkPlan(planType, [PlanType.MED_SPA, PlanType.CHIP_SPA]),
  isWaiver: checkPlan(planType, []),
  /** Keep excess methods to a minimum with `is` **/
  is: (validPlanTypes: PlanType[]) => checkPlan(planType, validPlanTypes),
});

export const PackageCheck = (data: OsMainSourceItem) => ({
  plans: PlanCheck(data.planType), // Loads values by calling functions on creation
  actions: ActionAvailabilityCheck, // Delivers methods instead of values
});
