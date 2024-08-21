import { FormSchema, DefaultFieldGroupProps } from "shared-types";

export const v202401: FormSchema = {
  header:
    "Premiums and cost sharing G2a: Cost-sharing amounts—Categorically needy individuals",
  subheader: "1916 | 1916A | 42 CFR 447.52 through 447.54",
  formId: "g2a",
  sections: [
    {
      title: "Overview",
      sectionId: "overview",
      form: [
        {
          slots: [
            {
              rhf: "Select",
              rules: { required: "* Required" },
              name: "state-charge-categorically-needy",
              labelClassName: "text-black font-bold",
              label:
                "Does the state charge cost sharing to all categorically needy (mandatory coverage and options for coverage) individuals?",
              props: {
                className: "w-48",
                options: [
                  {
                    label: "Yes",
                    value: "yes",
                  },
                  {
                    label: "No",
                    value: "no",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      title:
        "Services or items with the same cost-sharing amounts for all incomes",
      subsection: true,
      sectionId: "services-same-all-income",
      form: [
        {
          slots: [
            {
              rhf: "FieldArray",
              name: "service-item",
              props: {
                ...DefaultFieldGroupProps,
                appendText: "Add service or item",
                removeText: "Remove",
                fieldArrayClassName: DefaultFieldGroupProps.fieldArrayClassName,
              },
              fields: [
                {
                  rhf: "Input",
                  name: "service-item-name",
                  rules: { required: "* Required" },
                  props: { className: "w-96" },
                  labelClassName: "text-black font-bold",
                  label: "Service or Item",
                },
                {
                  rhf: "WrappedGroup",
                  name: "wrapped",
                  props: {
                    wrapperClassName: "flex-row flex w-full gap-5",
                  },
                  fields: [
                    {
                      rhf: "Input",
                      name: "amount",
                      rules: {
                        pattern: {
                          value: /^[0-9]\d*$/,
                          message: "Must be a positive integer value",
                        },
                        required: "* Required",
                      },
                      formItemClassName: "w-48",
                      labelClassName: "text-black font-bold",
                      label: "Amount",
                    },
                    {
                      rhf: "Select",
                      name: "dollar-or-percent",
                      rules: { required: "* Required" },
                      formItemClassName: "w-56",
                      labelClassName: "text-black font-bold",
                      label: "Dollars or percentage",
                      props: {
                        options: [
                          {
                            label: "Dollar",
                            value: "dollar",
                          },
                          {
                            label: "Percentage",
                            value: "percentage",
                          },
                        ],
                      },
                    },
                    {
                      rhf: "Select",
                      name: "unit",
                      rules: { required: "* Required" },
                      labelClassName: "text-black font-bold",
                      label: "Unit",
                      formItemClassName: "w-48",
                      props: {
                        customSort: "noSort",
                        options: [
                          { label: "Day", value: "Day" },
                          { label: "Month", value: "Month" },
                          { label: "Visit", value: "Visit" },
                          { label: "Prescription", value: "Prescription" },
                          { label: "15 minute", value: "15 minute" },
                          { label: "30 minute", value: "30 minute" },
                          { label: "Hour", value: "Hour" },
                          { label: "Trip", value: "Trip" },
                          { label: "Encounter", value: "Encounter" },
                          { label: "Pair", value: "Pair" },
                          { label: "Item", value: "Item" },
                          { label: "Procedure", value: "Procedure" },
                          { label: "Entire Stay", value: "Entire Stay" },
                          { label: "Other", value: "Other" },
                        ],
                      },
                    },
                  ],
                },
                {
                  rhf: "Textarea",
                  name: "explanation",
                  labelClassName: "text-black font-bold",
                  label: "Explanation (optional)",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Services or items with cost-sharing amounts that vary by income",
      subsection: true,
      sectionId: "services-vary-by-income",
      form: [
        {
          slots: [
            {
              name: "service-item",
              rhf: "FieldArray",
              props: {
                ...DefaultFieldGroupProps,
                appendText: "Add service or item",
                removeText: "Remove",
                fieldArrayClassName: DefaultFieldGroupProps.fieldArrayClassName,
              },
              fields: [
                {
                  rhf: "Input",
                  rules: { required: "* Required" },
                  name: "service-item-name",
                  props: { className: "w-96" },
                  labelClassName: "text-black font-bold",
                  label: "Service or Item",
                },
                {
                  name: "array-label-non-child-style",
                  rhf: "TextDisplay",
                  text: "Income ranges for cost-sharing amount",
                  props: { className: "text-black font-bold" },
                },
                {
                  rhf: "FieldArray",
                  name: "inc-range-cost-share-amount",
                  formItemClassName:
                    "ml-[0.6rem] px-4  border-l-4 border-l-primary mt-2",
                  props: {
                    appendText: "Add range",
                    divider: true,
                    fieldArrayClassName:
                      DefaultFieldGroupProps.fieldArrayClassName,
                  },
                  fields: [
                    {
                      rhf: "WrappedGroup",
                      name: "wrapped",
                      props: {
                        wrapperClassName:
                          "space-between flex-row flex w-full gap-5",
                      },
                      fields: [
                        {
                          rhf: "Input",
                          rules: {
                            pattern: {
                              value: /^\d*(?:\.\d{1,2})?$/,
                              message:
                                "Must be a positive number, maximum of two decimals, no commas. e.g. 1234.56",
                            },
                            required: "* Required",
                          },
                          name: "income-greater-than",
                          formItemClassName: "w-48",
                          labelClassName: "text-black font-bold",
                          label: "Income greater than ($)",
                        },
                        {
                          rhf: "Input",
                          rules: {
                            pattern: {
                              value: /^\d*(?:\.\d{1,2})?$/,
                              message:
                                "Must be a positive number, maximum of two decimals, no commas. e.g. 1234.56",
                            },
                            required: "* Required",
                          },
                          name: "income-lesser-than",
                          labelClassName: "text-black font-bold",
                          label: "Income less than or equal to ($)",
                        },
                      ],
                    },
                    {
                      rhf: "WrappedGroup",
                      name: "wrapped",
                      props: {
                        wrapperClassName:
                          "space-between flex-row flex w-full gap-5",
                      },
                      fields: [
                        {
                          rhf: "Input",
                          rules: {
                            pattern: {
                              value: /^[0-9]\d*$/,
                              message: "Must be a positive integer value",
                            },
                            required: "* Required",
                          },
                          name: "amount",
                          formItemClassName: "w-48",
                          labelClassName: "text-black font-bold",
                          label: "Amount",
                        },
                        {
                          rhf: "Select",
                          rules: { required: "* Required" },
                          name: "dollar-or-percent",
                          formItemClassName: "w-56",
                          labelClassName: "text-black font-bold",
                          label: "Dollars or percentage",
                          props: {
                            options: [
                              {
                                label: "Dollar",
                                value: "dollar",
                              },
                              {
                                label: "Percentage",
                                value: "percentage",
                              },
                            ],
                          },
                        },
                        {
                          rhf: "Select",
                          rules: { required: "* Required" },
                          name: "unit",
                          formItemClassName: "w-48",
                          labelClassName: "text-black font-bold",
                          label: "Unit",
                          props: {
                            customSort: "noSort",
                            options: [
                              { label: "Day", value: "Day" },
                              { label: "Month", value: "Month" },
                              { label: "Visit", value: "Visit" },
                              { label: "Prescription", value: "Prescription" },
                              { label: "15 minute", value: "15 minute" },
                              { label: "30 minute", value: "30 minute" },
                              { label: "Hour", value: "Hour" },
                              { label: "Trip", value: "Trip" },
                              { label: "Encounter", value: "Encounter" },
                              { label: "Pair", value: "Pair" },
                              { label: "Item", value: "Item" },
                              { label: "Procedure", value: "Procedure" },
                              { label: "Entire Stay", value: "Entire Stay" },
                              { label: "Other", value: "Other" },
                            ],
                          },
                        },
                      ],
                    },
                    {
                      rhf: "Textarea",
                      name: "explanation",
                      labelClassName: "text-black font-bold",
                      label: "Explanation (optional)",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title:
        "Cost sharing for non-preferred drugs charged to otherwise exempt individuals",
      subsection: true,
      sectionId: "cost-share-charge-otherwise-exempt",
      form: [
        {
          slots: [
            {
              rhf: "Select",
              rules: { required: "* Required" },
              name: "charge-otherwise-exempt",
              labelClassName: "text-black font-bold",
              label:
                "Does the state charge cost sharing for non-preferred drugs to otherwise exempt individuals?",
              props: {
                className: "w-48",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ],
              },
            },
            {
              rhf: "Select",
              rules: { required: "* Required" },
              name: "charges-same-as-non-exempt",
              labelClassName: "text-black font-bold",
              label:
                "Are the cost-sharing charges for non-preferred drugs imposed on otherwise exempt individuals the same as the charges imposed on non-exempt individuals?",
              props: {
                className: "w-48",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ],
              },
              dependency: {
                conditions: [
                  {
                    type: "expectedValue",
                    name: "g2a_cost-share-charge-otherwise-exempt_charge-otherwise-exempt",
                    expectedValue: "yes",
                  },
                ],
                effect: { type: "show" },
              },
            },
            {
              name: "charge-rate",
              rhf: "FieldArray",
              props: {
                appendText: "Add charge",
                fieldArrayClassName: DefaultFieldGroupProps.fieldArrayClassName,
                divider: true,
              },
              dependency: {
                conditions: [
                  {
                    type: "expectedValue",
                    name: "g2a_cost-share-charge-otherwise-exempt_charges-same-as-non-exempt",
                    expectedValue: "no",
                  },
                ],
                effect: { type: "show" },
              },
              formItemClassName:
                "ml-[0.6rem] px-4  border-l-4 border-l-primary mt-2",
              fields: [
                {
                  rhf: "WrappedGroup",
                  name: "rateWrapper",
                  props: {
                    wrapperClassName:
                      "space-between flex-row flex w-full gap-5",
                  },
                  fields: [
                    {
                      rhf: "Input",
                      rules: {
                        pattern: {
                          value: /^[0-9]\d*$/,
                          message: "Must be a positive integer value",
                        },
                        required: "* Required",
                      },
                      name: "amount",
                      formItemClassName: "w-48",
                      labelClassName: "text-black font-bold",
                      label: "Amount",
                    },
                    {
                      rhf: "Select",
                      rules: { required: "* Required" },
                      name: "dollar-or-percent",
                      formItemClassName: "w-56",
                      labelClassName: "text-black font-bold",
                      label: "Dollars or percentage",
                      props: {
                        options: [
                          {
                            label: "Dollar",
                            value: "dollar",
                          },
                          {
                            label: "Percentage",
                            value: "percentage",
                          },
                        ],
                      },
                    },
                    {
                      rhf: "Select",
                      name: "unit",
                      rules: { required: "* Required" },
                      formItemClassName: "w-48",
                      labelClassName: "text-black font-bold",
                      label: "Unit",
                      props: {
                        customSort: "noSort",
                        options: [
                          { label: "Day", value: "Day" },
                          { label: "Month", value: "Month" },
                          { label: "Visit", value: "Visit" },
                          { label: "Prescription", value: "Prescription" },
                          { label: "15 minute", value: "15 minute" },
                          { label: "30 minute", value: "30 minute" },
                          { label: "Hour", value: "Hour" },
                          { label: "Trip", value: "Trip" },
                          { label: "Encounter", value: "Encounter" },
                          { label: "Pair", value: "Pair" },
                          { label: "Item", value: "Item" },
                          { label: "Procedure", value: "Procedure" },
                          { label: "Entire Stay", value: "Entire Stay" },
                          { label: "Other", value: "Other" },
                        ],
                      },
                    },
                  ],
                },
                {
                  rhf: "Textarea",
                  name: "explanation",
                  labelClassName: "text-black font-bold",
                  label: "Explanation (optional)",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title:
        "Cost sharing for non-emergency services provided in the hospital emergency department charged to otherwise exempt individuals",
      subsection: true,
      sectionId: "cost-share-hospital-emergency-charge-otherwise-exempt",
      form: [
        {
          slots: [
            {
              rhf: "Select",
              rules: { required: "* Required" },
              name: "charge-otherwise-exempt",
              labelClassName: "text-black font-bold",
              label:
                "Does the state charge cost sharing for non-emergency services provided in the hospital emergency department to otherwise exempt individuals?",
              props: {
                className: "w-48",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ],
              },
            },
            {
              rhf: "Select",
              rules: { required: "* Required" },
              name: "charges-same-as-non-exempt",
              labelClassName: "text-black font-bold",
              label:
                "Are the cost-sharing charges for non-emergency services provided in the hospital emergency department imposed on otherwise exempt individuals the same as the charges imposed on non-exempt individuals?",
              props: {
                className: "w-48",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ],
              },
              dependency: {
                conditions: [
                  {
                    type: "expectedValue",
                    name: "g2a_cost-share-hospital-emergency-charge-otherwise-exempt_charge-otherwise-exempt",
                    expectedValue: "yes",
                  },
                ],
                effect: { type: "show" },
              },
            },
            {
              name: "charge-rate",
              rhf: "FieldArray",
              rules: { required: "* Required" },
              props: {
                appendText: "Add charge",
                fieldArrayClassName: DefaultFieldGroupProps.fieldArrayClassName,
                divider: true,
              },
              dependency: {
                conditions: [
                  {
                    type: "expectedValue",
                    name: "g2a_cost-share-hospital-emergency-charge-otherwise-exempt_charges-same-as-non-exempt",
                    expectedValue: "no",
                  },
                ],
                effect: { type: "show" },
              },
              formItemClassName:
                "ml-[0.6rem] px-4 border-l-4 border-l-primary mt-2",
              fields: [
                {
                  rhf: "WrappedGroup",
                  name: "rateWrapper",
                  props: {
                    wrapperClassName:
                      "space-between flex-row flex w-full gap-5",
                  },
                  fields: [
                    {
                      rhf: "Input",
                      rules: {
                        pattern: {
                          value: /^[0-9]\d*$/,
                          message: "Must be a positive integer value",
                        },
                        required: "* Required",
                      },
                      formItemClassName: "w-46",
                      name: "amount",
                      labelClassName: "text-black font-bold",
                      label: "Amount",
                    },
                    {
                      rhf: "Select",
                      rules: { required: "* Required" },
                      name: "dollar-or-percent",
                      formItemClassName: "w-56",
                      labelClassName: "text-black font-bold",
                      label: "Dollars or percentage",
                      props: {
                        options: [
                          {
                            label: "Dollar",
                            value: "dollar",
                          },
                          {
                            label: "Percentage",
                            value: "percentage",
                          },
                        ],
                      },
                    },
                    {
                      rhf: "Select",
                      rules: { required: "* Required" },
                      name: "unit",
                      formItemClassName: "w-40",
                      labelClassName: "text-black font-bold",
                      label: "Unit",
                      props: {
                        customSort: "noSort",
                        options: [
                          { label: "Day", value: "Day" },
                          { label: "Month", value: "Month" },
                          { label: "Visit", value: "Visit" },
                          { label: "Prescription", value: "Prescription" },
                          { label: "15 minute", value: "15 minute" },
                          { label: "30 minute", value: "30 minute" },
                          { label: "Hour", value: "Hour" },
                          { label: "Trip", value: "Trip" },
                          { label: "Encounter", value: "Encounter" },
                          { label: "Pair", value: "Pair" },
                          { label: "Item", value: "Item" },
                          { label: "Procedure", value: "Procedure" },
                          { label: "Entire Stay", value: "Entire Stay" },
                          { label: "Other", value: "Other" },
                        ],
                      },
                    },
                  ],
                },
                {
                  rhf: "Textarea",
                  name: "explanation",
                  labelClassName: "text-black font-bold",
                  label: "Explanation (optional)",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
