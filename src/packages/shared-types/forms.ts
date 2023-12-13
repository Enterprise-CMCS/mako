import {
  Control,
  FieldArrayPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import {
  CalendarProps,
  InputProps,
  RadioProps,
  SelectProps,
  SwitchProps,
  TextareaProps,
} from "shared-types";

export interface FormSchema {
  header: string;
  sections: Section[];
}

export type RHFSlotProps = {
  name: string;
  label?: string;
  labelStyling?: string;
  groupNamePrefix?: string;
  description?: string;
  dependency?: DependencyRule;
  rules?: RegisterOptions;
} & {
  [K in keyof RHFComponentMap]: {
    rhf: K;
    props?: RHFComponentMap[K];
    fields?: K extends "FieldArray"
      ? RHFSlotProps[]
      : K extends "FieldGroup"
      ? RHFSlotProps[]
      : never;
  };
}[keyof RHFComponentMap];

export type RHFOption = {
  label: string;
  value: string;
  form?: FormGroup[];
  slots?: RHFSlotProps[];
};

export type RHFComponentMap = {
  Input: InputProps & {
    label?: string;
    description?: string;
  };
  Textarea: TextareaProps;
  Switch: SwitchProps;
  Select: SelectProps & { sort?: "ascending" | "descending" };
  Radio: RadioProps & {
    options: RHFOption[];
  };
  DatePicker: CalendarProps;
  Checkbox: {
    options: RHFOption[];
  };
  FieldArray: {
    appendText?: string;
  };
  FieldGroup: {
    appendText?: string;
    removeText?: string;
  };
};

export type FormGroup = {
  description?: string;
  slots: RHFSlotProps[];
  wrapperStyling?: string;
  dependency?: DependencyRule;
};

export interface Section {
  title: string;
  form: FormGroup[];
  dependency?: DependencyRule;
}

export interface Document {
  header: string;
  sections: Section[];
}

export type FieldArrayProps<
  T extends FieldValues,
  TFieldArrayName extends FieldArrayPath<T> = FieldArrayPath<T>
> = {
  control: Control<T, unknown>;
  name: TFieldArrayName;
  fields: RHFSlotProps[];
  groupNamePrefix?: string;
  appendText?: string;
};

export type FieldGroupProps<
  T extends FieldValues,
  TFieldArrayName extends FieldArrayPath<T> = FieldArrayPath<T>
> = {
  control: Control<T, unknown>;
  name: TFieldArrayName;
  fields: RHFSlotProps[];
  appendText?: string;
  removeText?: string;
  groupNamePrefix?: string;
};

type ConditionRules =
  | {
      type: "valueExists" | "valueNotExist";
    }
  | {
      type: "expectedValue";
      expectedValue: unknown;
    };

export type Condition = { name: string } & ConditionRules;

type Effects =
  | {
      type: "show" | "hide";
    }
  | {
      type: "setValue";
      newValue: unknown;
    };

export interface DependencyRule {
  conditions: Condition[];
  effect: Effects;
}

export interface DependencyWrapperProps {
  name?: string;
  dependency?: DependencyRule;
}
