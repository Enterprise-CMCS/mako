import { z } from "zod";
import { Link, useLocation } from "react-router-dom";
import { useGetUser } from "@/api/useGetUser";
import { useForm } from "react-hook-form";
import { submit } from "@/api/submissionService";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  BreadCrumbs,
  LoadingSpinner,
  SectionCard,
  SimplePageContainer,
} from "@/components";
import * as Inputs from "@/components/Inputs";
import { PlanType } from "shared-types";
import {
  zAttachmentOptional,
  zAttachmentRequired,
  zSpaIdSchema,
} from "@/pages/form/zod";
import * as Content from "@/pages/form/content";
import { formCrumbsFromPath } from "@/pages/form/form-breadcrumbs";
import { FAQ_TAB } from "@/components/Routing/consts";
import { useModalContext } from "@/components/Context/modalContext";
import { useNavigate } from "@/components/Routing";
import { useCallback } from "react";

const formSchema = z.object({
  id: zSpaIdSchema,
  additionalInformation: z.string().max(4000).optional(),
  attachments: z.object({
    currentStatePlan: zAttachmentRequired({ min: 1 }),
    amendedLanguage: zAttachmentRequired({ min: 1 }),
    coverLetter: zAttachmentRequired({ min: 1 }),
    budgetDocuments: zAttachmentOptional,
    publicNotice: zAttachmentOptional,
    tribalConsultation: zAttachmentOptional,
    other: zAttachmentOptional,
  }),
  proposedEffectiveDate: z.date(),
});
type ChipFormSchema = z.infer<typeof formSchema>;

// first argument in the array is the name that will show up in the form submission
// second argument is used when mapping over for the label
const attachmentList = [
  { name: "currentStatePlan", label: "Current State Plan", required: true },
  {
    name: "amendedLanguage",
    label: "Amended State Plan Language",
    required: true,
  },
  {
    name: "coverLetter",
    label: "Cover Letter",
    required: true,
  },
  {
    name: "budgetDocuments",
    label: "Budget Documents",
    required: false,
  },
  { name: "publicNotice", label: "Public Notice", required: false },
  { name: "tribalConsultation", label: "Tribal Consultation", required: false },
  { name: "other", label: "Other", required: false },
] as const;

export const ChipSpaFormPage = () => {
  const location = useLocation();
  const { data: user } = useGetUser();
  const navigate = useNavigate();
  const { setModalOpen, setContent, setOnAccept } = useModalContext();
  const acceptAction = useCallback(() => {
    setModalOpen(false);
    navigate({ path: "/dashboard" });
  }, []);
  const form = useForm<ChipFormSchema>({
    resolver: zodResolver(formSchema),
  });
  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      await submit<ChipFormSchema>({
        data: formData,
        endpoint: "/submit",
        user,
        authority: PlanType.CHIP_SPA,
      });
      navigate({ path: "/dashboard" });
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <SimplePageContainer>
      <BreadCrumbs options={formCrumbsFromPath(location.pathname)} />
      <Inputs.Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="my-6 space-y-8 mx-auto justify-center items-center flex flex-col"
        >
          <SectionCard title="CHIP SPA Details">
            <Content.FormIntroText />
            <Inputs.FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <Inputs.FormItem>
                  <div className="flex gap-4">
                    <Inputs.FormLabel className="text-lg font-bold">
                      SPA ID
                    </Inputs.FormLabel>
                    <Link
                      to="/faq/#spa-id-format"
                      target={FAQ_TAB}
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      What is my SPA ID?
                    </Link>
                  </div>
                  <Content.SpaIdFormattingDesc />
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
                <Inputs.FormItem className="max-w-sm">
                  <Inputs.FormLabel className="text-lg font-bold block">
                    Proposed Effective Date of CHIP SPA
                  </Inputs.FormLabel>
                  <Inputs.FormControl>
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
            <Content.AttachmentsSizeTypesDesc faqLink="/faq/#chip-spa-attachments" />
            {attachmentList.map(({ name, label, required }) => (
              <Inputs.FormField
                key={name}
                control={form.control}
                name={`attachments.${name}`}
                render={({ field }) => (
                  <Inputs.FormItem>
                    <Inputs.FormLabel>{label}</Inputs.FormLabel>
                    {required && (
                      <Inputs.FormDescription>
                        At least one attachment is required
                      </Inputs.FormDescription>
                    )}
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
              onClick={() => {
                setContent({
                  header: "Stop form submission?",
                  body: "All information you've entered on this form will be lost if you leave this page.",
                  acceptButtonText: "Yes, leave form",
                  cancelButtonText: "Return to form",
                });
                setOnAccept(() => acceptAction);
                setModalOpen(true);
              }}
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
