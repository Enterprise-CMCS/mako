import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Inputs from "@/components/Inputs";
import * as Content from "../../content";
import { useLocation } from "react-router-dom";
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
  zAdditionalInfo,
  zAttachmentOptional,
  zAttachmentRequired,
  zInitialWaiverNumberSchema,
} from "@/pages/form/zod";
import { ModalProvider, useModalContext } from "@/pages/form/modals";
import { formCrumbsFromPath } from "@/pages/form/form-breadcrumbs";

const formSchema = z.object({
  id: zInitialWaiverNumberSchema,
  proposedEffectiveDate: z.date(),
  attachments: z.object({
    b4WaiverApplication: zAttachmentRequired({ min: 1 }),
    tribalConsultation: zAttachmentOptional,
    other: zAttachmentOptional,
  }),
  additionalInformation: zAdditionalInfo,
});
type Waiver1915BCapitatedAmmendment = z.infer<typeof formSchema>;

// first argument in the array is the name that will show up in the form submission
// second argument is used when mapping over for the label
const attachmentList = [
  {
    name: "b4WaiverApplication",
    label:
      "1915(b)(4) FFS Selective Contracting (Streamlined) Waiver Application Pre-print",
    required: true,
  },
  {
    name: "tribalConsultation",
    label: "Tribal Consultation",
    required: false,
  },
  {
    name: "other",
    label: "Other",
    required: false,
  },
] as const;

export const Capitated1915BWaiverInitial = () => {
  const location = useLocation();
  const { data: user } = useGetUser();
  const { setCancelModalOpen, setSuccessModalOpen } = useModalContext();
  const handleSubmit: SubmitHandler<Waiver1915BCapitatedAmmendment> = async (
    formData
  ) => {
    try {
      // AK-0260.R04.02
      await submit<Waiver1915BCapitatedAmmendment>({
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

  const form = useForm<Waiver1915BCapitatedAmmendment>({
    resolver: zodResolver(formSchema),
  });

  return (
    <SimplePageContainer>
      <BreadCrumbs options={formCrumbsFromPath(location.pathname)} />
      <Inputs.Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="my-6 space-y-8 mx-auto justify-center flex flex-col"
        >
          <h1 className="text-2xl font-semibold mt-4 mb-2">
            1915(b) Initial Waiver Submission
          </h1>
          <SectionCard title="Initial Waiver Details">
            <Content.FormIntroText />
            <div className="flex flex-col">
              <Inputs.FormLabel className="font-semibold">
                Waiver Authority
              </Inputs.FormLabel>
              <span className="text-lg font-thin">
                All other 1915(b) Waivers
              </span>
            </div>
            <Inputs.FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <Inputs.FormItem>
                  <Inputs.FormLabel className="text-lg font-bold mr-1">
                    Initial Waiver Number
                  </Inputs.FormLabel>
                  <Inputs.RequiredIndicator />
                  <p className="text-gray-500 font-light">
                    Must be a new initial number with the format of
                    SS-####.R##.## or SS-#####.R##.##.
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
                    Proposed Effective Date of 1915(b) Initial Waiver
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
            <Alert className="mb-6" variant="destructive">
              Missing or malformed information. Please see errors above.
            </Alert>
          ) : null}
          {form.formState.isSubmitting ? (
            <div className="p-4">
              <LoadingSpinner />
            </div>
          ) : null}
          <div className="flex gap-2 justify-end">
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

export const Capitated1915BWaiverInitialPage = () => (
  <ModalProvider>
    <Capitated1915BWaiverInitial />
  </ModalProvider>
);
