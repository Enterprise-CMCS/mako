import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Inputs from "@/components/Inputs";
import * as Content from "../../content";
import { Link, useLocation } from "react-router-dom";
import { useGetUser } from "@/api/useGetUser";
import {
  Alert,
  BreadCrumbs,
  LoadingSpinner,
  SimplePageContainer,
  SectionCard,
} from "@/components";
import { submit } from "@/api/submissionService";
import { PlanType } from "shared-types";
import {
  zAttachmentOptional,
  zAttachmentRequired,
  zSpaIdSchema,
} from "@/pages/form/zod";
import { ModalProvider, useModalContext } from "@/pages/form/modals";
import { formCrumbsFromPath } from "@/pages/form/form-breadcrumbs";
import { FAQ_TAB } from "@/components/Routing/consts";

const formSchema = z.object({
  id: z.string(),
  ammendedWaiverNumber: z.string(),
  additionalInformation: z.string().max(4000).optional(),
  attachments: z.object({
    comprehensiveWaiverAppPre1915B: zAttachmentRequired({
      min: 1,
      max: 1,
      message: "Required: You must submit exactly one file for CMS Form 179.",
    }),
    comprehensiveWaiverCostEffectSpreadSheets1915B: zAttachmentRequired({
      min: 1,
    }),
    tribalConsultation: zAttachmentOptional,
    other: zAttachmentOptional,
  }),
  proposedEffectiveDate: z.date(),
});
type Waiver1915BContractingAmmendment = z.infer<typeof formSchema>;

// first argument in the array is the name that will show up in the form submission
// second argument is used when mapping over for the label
const attachmentList = [
  {
    name: "comprehensiveWaiverAppPre1915B",
    label: "1915(b) Comprehensive (Contracting) Waiver Application Pre-print",
    required: true,
  },
  {
    name: "comprehensiveWaiverCostEffectSpreadSheets1915B",
    label:
      "1915(b) Comprehensive (Contracting) Waiver Cost Effectiveness Spreadsheets",
    required: false,
  },
  {
    name: "tribalConsultation",
    label: "Tribal Consulation",
    required: false,
  },
  {
    name: "other",
    label: "Other",
    required: false,
  },
] as const;

export const Contracting1915BWaiverRenewal = () => {
  const location = useLocation();
  const { data: user } = useGetUser();
  const { setCancelModalOpen, setSuccessModalOpen } = useModalContext();
  const handleSubmit: SubmitHandler<Waiver1915BContractingAmmendment> = async (
    formData
  ) => {
    try {
      // AK-0260.R04.02
      await submit<Waiver1915BContractingAmmendment>({
        data: {
          ...formData,
        },
        endpoint: "/submit",
        user,
        authority: PlanType["1915b"],
      });
      setSuccessModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const form = useForm<Waiver1915BContractingAmmendment>({
    resolver: zodResolver(formSchema),
  });

  return (
    <SimplePageContainer>
      <BreadCrumbs options={formCrumbsFromPath(location.pathname)} />
      <Inputs.Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="my-6 space-y-8 mx-auto justify-center items-center flex flex-col"
        >
          <SectionCard title="1915(b) Waiver Amendment Details">
            <Content.FormIntroText />
            <Inputs.FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <Inputs.FormItem>
                  <div className="flex gap-4">
                    <Inputs.FormLabel className="text-lg font-bold">
                      Existing Waiver Number to Amend
                    </Inputs.FormLabel>
                    <Inputs.RequiredIndicator />
                  </div>
                  <p className="text-gray-500 font-light">
                    Enter the existing waiver number you are seeking to amend in
                    the format it was approved, using a dash after the two
                    character state abbreviation.
                  </p>
                  <Inputs.FormControl className="max-w-sm">
                    <Inputs.Input
                      {...field}
                      onInput={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                          e.target.value = e.target.value.toUpperCase();
                        }
                      }}
                    />
                  </Inputs.FormControl>
                  <Inputs.FormMessage />
                </Inputs.FormItem>
              )}
            />
            <Inputs.FormField
              control={form.control}
              name="ammendedWaiverNumber"
              render={({ field }) => (
                <Inputs.FormItem>
                  <div className="flex gap-4">
                    <Inputs.FormLabel className="text-lg font-bold">
                      1915(b) Waiver Amendment Number
                    </Inputs.FormLabel>
                    <Inputs.RequiredIndicator />
                    <Link
                      to="/faq/#spa-id-format"
                      target={FAQ_TAB}
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline flex items-center"
                    >
                      What is my 1915(b) Waiver Amendment Number?
                    </Link>
                  </div>
                  <p className="text-gray-500 font-light">
                    The Waiver Number must be in the format of SS-####.R##.## or
                    SS-#####.R##.##. For amendments, the last two digits start
                    with ‘01’ and ascends.
                  </p>
                  <Inputs.FormControl className="max-w-sm">
                    <Inputs.Input
                      {...field}
                      onInput={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                          e.target.value = e.target.value.toUpperCase();
                        }
                      }}
                    />
                  </Inputs.FormControl>
                  <Inputs.FormMessage />
                </Inputs.FormItem>
              )}
            />
            <Inputs.FormField
              control={form.control}
              name="proposedEffectiveDate"
              render={({ field }) => (
                <Inputs.FormItem className="max-w-lg">
                  <Inputs.FormLabel className="text-lg font-bold block">
                    Proposed Effective Date of 1915(b) Waiver Amendment
                  </Inputs.FormLabel>
                  <Inputs.FormControl className="max-w-sm">
                    <Inputs.DatePicker
                      onChange={field.onChange}
                      date={field.value}
                    />
                  </Inputs.FormControl>
                  <Inputs.FormMessage />
                </Inputs.FormItem>
              )}
            />
          </SectionCard>
          <SectionCard title="Attachments">
            <Content.AttachmentsSizeTypesDesc
              faqLink="/faq/#medicaid-spa-attachments"
              includeCMS179
            />
            {attachmentList.map(({ name, label, required }) => (
              <Inputs.FormField
                key={name}
                control={form.control}
                name={`attachments.${name}`}
                render={({ field }) => (
                  <Inputs.FormItem>
                    <Inputs.FormLabel>{label}</Inputs.FormLabel>
                    <Inputs.Upload
                      files={field?.value ?? []}
                      setFiles={field.onChange}
                    />
                    <Inputs.FormMessage />
                  </Inputs.FormItem>
                )}
              />
            ))}
          </SectionCard>
          <SectionCard title="Additional Information">
            <Inputs.FormField
              control={form.control}
              name="additionalInformation"
              render={({ field }) => (
                <Inputs.FormItem>
                  <Inputs.FormLabel className="font-normal">
                    Add anything else you would like to share with CMS, limited
                    to 4000 characters
                  </Inputs.FormLabel>
                  <Inputs.Textarea
                    {...field}
                    className="h-[200px] resize-none"
                  />
                  <Inputs.FormDescription>
                    4,000 characters allowed
                  </Inputs.FormDescription>
                </Inputs.FormItem>
              )}
            />
          </SectionCard>
          <Content.PreSubmissionMessage />
          {Object.keys(form.formState.errors).length !== 0 ? (
            <Alert className="mb-6 w-5/6" variant="destructive">
              Missing or malformed information. Please see errors above.
            </Alert>
          ) : null}
          {form.formState.isSubmitting ? (
            <div className="p-4">
              <LoadingSpinner />
            </div>
          ) : null}
          <div className="flex gap-2 justify-end w-5/6">
            <Inputs.Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="px-12"
            >
              Submit
            </Inputs.Button>
            <Inputs.Button
              type="button"
              variant="outline"
              onClick={() => setCancelModalOpen(true)}
              className="px-12"
            >
              Cancel
            </Inputs.Button>
          </div>
        </form>
      </Inputs.Form>
    </SimplePageContainer>
  );
};

export const Contracting1915BWaiverRenewalPage = () => (
  <ModalProvider>
    <Contracting1915BWaiverRenewal />
  </ModalProvider>
);
