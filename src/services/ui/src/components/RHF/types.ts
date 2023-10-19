import {
  Control,
  FieldArrayPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import type { ReactElement } from "react";
import {
  InputProps,
  SwitchProps,
  TextareaProps,
  SelectProps,
  RadioProps,
  CalendarProps,
} from "../Inputs";

export type RHFSlotProps = {
  name: string;
  label?: ReactElement | string;
  labelStyling?: string;
  description?: ReactElement | string;
  dependency?: DependencyRule;
} & {
  [K in keyof RHFComponentMap]: {
    rhf: K;
    props?: RHFComponentMap[K];
    rules?: RegisterOptions;
    fields?: K extends "FieldArray"
      ? RHFSlotProps[]
      : K extends "FieldGroup"
      ? RHFSlotProps[]
      : never;
  };
}[keyof RHFComponentMap];

export type RHFComponentMap = {
  Input: InputProps & {
    label?: ReactElement | string;
    description?: ReactElement | string;
  };
  Textarea: TextareaProps;
  Switch: SwitchProps;
  Select: SelectProps;
  Radio: RadioProps & {
    options: {
      label: string;
      value: any;
      form?: FormGroup[];
      slots?: RHFSlotProps[];
    }[];
  };
  DatePicker: CalendarProps;
  Checkbox: {
    options: {
      label: string;
      value: any;
      form?: FormGroup[];
      slots?: RHFSlotProps[];
    }[];
  };
  FieldArray: any;
  FieldGroup: {
    appendText: string;
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
  control: Control<T>;
  name: TFieldArrayName;
  fields: RHFSlotProps[];
};

export type FieldGroupProps<
  T extends FieldValues,
  TFieldArrayName extends FieldArrayPath<T> = FieldArrayPath<T>
> = {
  control: Control<T>;
  name: TFieldArrayName;
  fields: RHFSlotProps[];
  appendText?: string;
};

type ConditionRules =
  | {
      type: "valueExists" | "valueNotExist";
    }
  | {
      type: "expectedValue";
      expectedValue: unknown;
    };

type Condition = { name: string } & ConditionRules;

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
