import { RegisterOptions } from "react-hook-form";
import { RuleGenerator, SortFuncs, AdditionalRule } from "shared-types";

export const sortFunctions: {
  [x in SortFuncs]: (a: string, b: string) => number;
} = {
  noSort: () => 0,
  reverseSort: (a, b) => b.localeCompare(a),
};

export function stringCompare(
  a: { label: string },
  b: { label: string },
): number {
  const aIsNumber = !isNaN(parseFloat(a.label));
  const bIsNumber = !isNaN(parseFloat(b.label));

  if (aIsNumber && bIsNumber) {
    return Number(a.label) - Number(b.label);
  } else if (aIsNumber) {
    return -1;
  } else if (bIsNumber) {
    return 1;
  } else {
    return a.label.localeCompare(b.label);
  }
}

export const ruleGenerator: RuleGenerator = (rules, addtnlRules) => {
  if (!rules && !addtnlRules) return undefined;
  const simpleRules = rules ?? {};
  const customRules = addtnlRules
    ? { validate: addtnlRules.reduce(valReducer, {}) }
    : {};

  return { ...simpleRules, ...customRules };
};

export const valReducer = (
  valSet: RegisterOptions["validate"],
  rule: AdditionalRule,
  index: number,
): RegisterOptions["validate"] => {
  const valName = `${rule.type}_${index}`;

  switch (rule.type) {
    case "lessThanField":
      return {
        ...valSet,
        [valName]: (value, fields) => {
          if (
            !rule.strictGreater &&
            parseFloat(value) <= parseFloat(fields[rule.fieldName])
          )
            return true;
          else if (parseFloat(value) < parseFloat(fields[rule.fieldName]))
            return true;
          return rule.message;
        },
      };
    case "greaterThanField":
      return {
        ...valSet,
        [valName]: (value, fields) => {
          if (
            !rule.strictGreater &&
            parseFloat(value) >= parseFloat(fields[rule.fieldName])
          )
            return true;
          else if (parseFloat(value) > parseFloat(fields[rule.fieldName]))
            return true;
          return rule.message;
        },
      };
    case "cannotCoexist":
      return {
        ...valSet,
        [valName]: (value, fields) => {
          if (value !== undefined && fields[rule.fieldName] === undefined)
            return true;
          if (value === undefined && fields[rule.fieldName] !== undefined)
            return true;
          return rule.message;
        },
      };
    default:
      return { ...valSet };
  }
};
