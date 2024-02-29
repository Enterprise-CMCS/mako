import { FormSchema } from "shared-types";

export const v202401: FormSchema = {
  header:
    "ABP 2a: Voluntary benefit package selection assurances - Eligibility group under Section 1902(a)(10)(A)(i)(VIII) of the Act ",
  sections: [
    {
      title: "Benefit alignment and requirements",
      form: [
        {
          slots: [
            {
              rhf: "Select",
              name: "is_state_territory_aligned_ABP",
              label:
                "The state/territory has fully aligned its EHB-defined Alternative Benefit Plan (ABP) benefits with its approved Medicaid state plan.",
              labelStyling: "font-bold text-[0.8rem]",
              description:
                "Therefore, the state/territory meets the requirements for voluntary choice of benefit package for individuals exempt from mandatory participation in a Section 1937 ABP.",
              descriptionAbove: true,
              descriptionStyling: "font-bold text-black",
              rules: {
                required: "* Required",
              },
              props: {
                className: "w-[150px]",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ],
              },
            },

            {
              rhf: "Textarea",
              name: "explain_how_state_territory_aligned_ABP",
              description:
                "Explain how the state has fully aligned its benefits.",
              descriptionAbove: true,
              descriptionStyling: "font-bold text-black",
              rules: {
                required: "* Required",
              },
              dependency: {
                conditions: [
                  {
                    name: "is_state_territory_aligned_ABP",
                    type: "expectedValue",
                    expectedValue: "yes",
                  },
                ],
                effect: { type: "show" },
              },
            },
          ],
        },
      ],
    },
    {
      title: "Assurances",
      form: [
        {
          description:
            "These assurances must be made by the state/territory if the Adult eligibility group is included in the ABP population.",
          slots: [
            {
              rhf: "Checkbox",
              name: "assurances",
              rules: { required: "* Required" },
              props: {
                options: [
                  {
                    label:
                      "The state/territory shall enroll all participants in the Individuals at or below 133% FPL age 19 through 64 (Section 1902(a)(10)(A)(i)(VIII)) eligibility group in the ABP specified in this state plan amendment, except as follows: A beneficiary in the eligibility group at Section 1902(a)(10)(A)(i)(VIII) who is determined to meet one of the exemption criteria at 45 CFR 440.315 will receive a choice of a benefit package that is either an ABP that includes essential health benefits and is subject to all Section 1937 requirements or an ABP that is the state/territory’s approved Medicaid state plan not subject to Section 1937 requirements. The state/territory’s approved Medicaid state plan includes all approved state plan programs based on any state plan authority and approved Section 1915(c) waivers, if the state has amended them to include the eligibility group at Section 1902(a)(10)(A)(i)(VIII).",
                    value: "at_or_bellow_133_age_19_through_64",
                  },
                  {
                    label:
                      "The state/territory must have a process in place to identify individuals that meet the exemption criteria, and the state/territory must comply with requirements related to providing the option of enrollment in an ABP defined using Section 1937 requirements or an ABP defined as the state/territory's approved Medicaid state plan not subject to Section 1937 requirements.",
                    value:
                      "state_territory_must_have_a_process_that_meets_exemption_criteria",
                  },
                  {
                    label:
                      "Once an individual is identified, the state/territory assures it will effectively inform the individual of the following: A. That enrollment in the specified ABP is voluntary B. That the individual may disenroll from the ABP defined subject to Section 1937 requirements at any time and instead receive an ABP defined as the approved state/territory Medicaid state plan not subject to Section 1937 requirements. C. What the process is for transferring to the state plan-based ABP",
                    value: "individual_identified_must_inform_the_individual",
                  },
                  {
                    label:
                      "The state/territory assures it will inform the individual of the following: A. The benefits available as ABP coverage defined using Section 1937 requirements as compared to ABP coverage defined as the state/territory's approved Medicaid state plan and not subject to Section 1937 requirements B. The costs of the different benefit packages and a comparison of how the ABP subject to Section 1937 requirements differs from the ABP defined as the approved Medicaid state/territory plan benefits",
                    value:
                      "state_territory_assures_it_will_inform_the_individual",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      title: "Delivery of information",
      form: [
        {
          description:
            "The state/territory must select a base benchmark plan as the basis for providing essential health benefits in its benchmark or benchmark-equivalent package.",
          slots: [
            {
              rhf: "Checkbox",
              name: "assurances",
              rules: { required: "* Required" },
              props: {
                options: [
                  {
                    label: "Letter",
                    value: "letter",
                  },
                  {
                    label: "Email",
                    value: "email",
                  },
                  {
                    label: "Other",
                    value: "other",
                    slots: [
                      {
                        rhf: "Input",
                        name: "describe_other",
                        label: "Describe",
                        labelStyling: "font-bold",
                      },
                    ],
                  },
                ],
              },
            },
            {
              rhf: "Upload",
              name: "provide_copy_of_letter_email_other",
              description:
                "Provide a copy of the letter, email, or other communication.",
              descriptionAbove: true,
              descriptionStyling: "font-bold text-black",
              props: { maxFiles: 3 },
            },
            {
              rhf: "Input",
              name: "when_to_inform",
              descriptionAbove: true,
              description:
                "When did/will the state/territory inform the individuals?",
              descriptionStyling: "font-bold text-black",
            },
            {
              rhf: "Textarea",
              name: "describe_process_in_section1902",
              descriptionAbove: true,
              description:
                "Describe the state/territory's process for allowing individuals in the Section 1902(a)(10)(A)(i)(VIII) eligibility group who meet exemption criteria to disenroll from the ABP using Section 1937 requirements and enroll in the ABP that is the state/territory's approved Medicaid state plan.",
              descriptionStyling: "font-bold text-black",
            },
            {
              rhf: "Checkbox",
              name: "state_territory_assures_it_will_document_exempt_individuals",
              formItemStyling: "whitespace-pre-wrap",
              props: {
                options: [
                  {
                    label:
                      "The state/territory assures it will inform the individual of the following: A. The benefits available as ABP coverage defined using Section 1937 requirements as compared to ABP coverage defined as the state/territory's approved Medicaid state plan and not subject to Section 1937 requirements<br><br> B. The costs of the different benefit packages and a comparison of how the ABP subject to Section 1937 requirements differs from the ABP defined as the approved Medicaid state/territory plan benefits",
                    value:
                      "state_territory_will_document_exempt_individuals_eligibility",
                  },
                ],
              },
            },
            {
              rhf: "Checkbox",
              name: "where_will_information_be_documented",
              descriptionAbove: true,
              descriptionStyling: "font-bold text-black",
              description: "Where will the information be documented?",
              props: {
                options: [
                  {
                    label: "In the eligibility system",
                    value: "in_eligibility_system",
                  },
                  {
                    label: "In the hard copy of the case record",
                    value: "hard_copy_of_case_record",
                  },
                  {
                    label: "Other",
                    value: "other",
                    slots: [
                      {
                        rhf: "Input",
                        name: "describe_other",
                        label: "Describe",
                        labelStyling: "font-bold",
                      },
                    ],
                  },
                ],
              },
            },
            {
              rhf: "Checkbox",
              name: "what_documentation_will_be_maintained_in_the_eligibility_file",
              descriptionAbove: true,
              descriptionStyling: "font-bold text-black",
              description:
                "What documentation will be maintained in the eligibility file?",
              formItemStyling: "border-b-4",
              props: {
                options: [
                  {
                    label: "Copy of correspondence sent to the individual",
                    value: "copy_of_correspondence_sent_to_the_individual",
                  },
                  {
                    label:
                      "Signed documentation from the individual consenting to enrollment in the ABP",
                    value:
                      "signed_documentation_from_individual_consenting_enrollment_ABP",
                  },
                  {
                    label: "Other",
                    value: "other",
                    slots: [
                      {
                        rhf: "Input",
                        name: "describe_other",
                        label: "Describe",
                        labelStyling: "font-bold",
                      },
                    ],
                  },
                ],
              },
            },
            {
              rhf: "Checkbox",
              name: "state_territory_assures_maintain_data",
              props: {
                options: [
                  {
                    label:
                      "The state/territory assures that it will maintain data that tracks the total number of individuals who have voluntarily enrolled in either ABP coverage subject to Section 1937 requirements or ABP coverage defined as the state/territory's approved Medicaid state plan not subject to Section 1937 requirements.",
                    value: "state_territory_assures_it_will_maintain_data",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      title: "Additional information",
      form: [
        {
          description:
            "Other information about benefit package selection assurances for exempt participants (optional)",
          slots: [
            {
              rhf: "Textarea",
              name: "additional_information",
            },
          ],
        },
      ],
    },
  ],
};
