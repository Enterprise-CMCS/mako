import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as I from "@/components/Inputs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetUser } from "@/api/useGetUser";
import {
  Alert,
  BreadCrumbs,
  LoadingSpinner,
  SimplePageContainer,
  SectionCard,
} from "@/components";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { FAQ_TARGET, ROUTES } from "@/routes";
import { NEW_SUBMISSION_CRUMBS } from "@/pages/create/create-breadcrumbs";
import { submit } from "@/api/submissionService";
import { Authority } from "shared-types";
import {
  zAttachmentOptional,
  zAttachmentRequired,
  zSpaIdSchema,
} from "@/pages/form/zod";

const formSchema = z.object({
  id: zSpaIdSchema,
  additionalInformation: z.string().max(4000).optional(),
  attachments: z.object({
    cmsForm179: zAttachmentRequired({
      min: 1,
      message: "Required: You must submit exactly one file for CMS Form 179.",
    }),
    spaPages: zAttachmentRequired({ min: 0 }),
    coverLetter: zAttachmentOptional,
    tribalEngagement: zAttachmentOptional,
    existingStatePlanPages: zAttachmentOptional,
    publicNotice: zAttachmentOptional,
    sfq: zAttachmentOptional,
    tribalConsultation: zAttachmentOptional,
    other: zAttachmentOptional,
  }),
  proposedEffectiveDate: z.date(),
});
type MedicaidFormSchema = z.infer<typeof formSchema>;

// first argument in the array is the name that will show up in the form submission
// second argument is used when mapping over for the label
const attachmentList = [
  { name: "cmsForm179", label: "CMS Form 179", required: true },
  { name: "spaPages", label: "SPA Pages", required: true },
  { name: "coverLetter", label: "Cover Letter", required: false },
  {
    name: "tribalEngagement",
    label: "Document Demonstrating Good-Faith Tribal Engagement",
    required: false,
  },
  {
    name: "existingStatePlanPages",
    label: "Existing State Plan Page(s)",
    required: false,
  },
  { name: "publicNotice", label: "Public Notice", required: false },
  { name: "sfq", label: "Standard Funding Questions (SFQs)", required: false },
  { name: "tribalConsultation", label: "Tribal Consultation", required: false },
  { name: "other", label: "Other", required: false },
] as const;

export const MedicaidForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useGetUser();
  const handleSubmit: SubmitHandler<MedicaidFormSchema> = async (formData) => {
    try {
      await submit<MedicaidFormSchema>({
        data: formData,
        endpoint: "/submit",
        user,
        authority: Authority.MED_SPA,
      });
      setSuccessModalIsOpen(true);
    } catch (e) {
      console.error(e);
    }
  };
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);

  const form = useForm<MedicaidFormSchema>({
    resolver: zodResolver(formSchema),
  });

  return (
    <SimplePageContainer>
      <BreadCrumbs options={NEW_SUBMISSION_CRUMBS(location.pathname)} />
      <I.Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="my-6 space-y-8 mx-auto justify-center items-center flex flex-col"
        >
          <SectionCard title="Medicaid SPA Details">
            <p className="font-light  max-w-4xl">
              Once you submit this form, a confirmation email is sent to you and
              to CMS. CMS will use this content to review your package, and you
              will not be able to edit this form. If CMS needs any additional
              information, they will follow up by email.{" "}
              <strong className="bold">
                If you leave this page, you will lose your progress on this
                form.
              </strong>
            </p>
            <I.FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <I.FormItem>
                  <div className="flex gap-4">
                    <I.FormLabel className="text-lg font-bold">
                      SPA ID
                    </I.FormLabel>
                    <Link
                      to="/faq/#spa-id-format"
                      target={FAQ_TARGET}
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      What is my SPA ID?
                    </Link>
                  </div>
                  <p className="text-gray-500 font-light">
                    Must follow the format SS-YY-NNNN or SS-YY-NNNN-XXXX.
                  </p>
                  <p className="italic text-gray-500 font-light">
                    Reminder - CMS recommends that all SPA numbers start with
                    the year in which the package is submitted.
                  </p>
                  <I.FormControl className="max-w-sm">
                    <I.Input
                      {...field}
                      onInput={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                          e.target.value = e.target.value.toUpperCase();
                        }
                      }}
                    />
                  </I.FormControl>
                  <I.FormMessage />
                </I.FormItem>
              )}
            />
            <I.FormField
              control={form.control}
              name="proposedEffectiveDate"
              render={({ field }) => (
                <I.FormItem className="max-w-sm">
                  <I.FormLabel className="text-lg font-bold block">
                    Proposed Effective Date of Medicaid SPA
                  </I.FormLabel>
                  <I.FormControl>
                    <I.DatePicker
                      onChange={field.onChange}
                      date={field.value}
                    />
                  </I.FormControl>
                  <I.FormMessage />
                </I.FormItem>
              )}
            />
          </SectionCard>
          <SectionCard title="Attachments">
            <p>
              Maximum file size of 80 MB per attachment.{" "}
              <strong>
                You can add multiple files per attachment type, except for the
                CMS Form 179.
              </strong>{" "}
              Read the description for each of the attachment types on the{" "}
              {
                <Link
                  to="/faq/#medicaid-spa-attachments"
                  target={FAQ_TARGET}
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  FAQ Page
                </Link>
              }
              .
            </p>
            <p>
              We accept the following file formats:{" "}
              <strong className="bold">.docx, .jpg, .png, .pdf, .xlsx,</strong>{" "}
              and a few others. See the full list on the{" "}
              {
                <Link
                  to="/faq/#acceptable-file-formats"
                  target={FAQ_TARGET}
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  FAQ Page
                </Link>
              }
              .
            </p>
            {attachmentList.map(({ name, label, required }) => (
              <I.FormField
                key={name}
                control={form.control}
                name={`attachments.${name}`}
                render={({ field }) => (
                  <I.FormItem>
                    <I.FormLabel>{label}</I.FormLabel>
                    {
                      <I.FormDescription>
                        {name === "cmsForm179"
                          ? "One attachment is required"
                          : ""}
                        {name === "spaPages"
                          ? "At least one attachment is required"
                          : ""}
                      </I.FormDescription>
                    }
                    <I.Upload
                      files={field?.value ?? []}
                      setFiles={field.onChange}
                    />
                    <I.FormMessage />
                  </I.FormItem>
                )}
              />
            ))}
          </SectionCard>
          <SectionCard title="Additional Information">
            <I.FormField
              control={form.control}
              name="additionalInformation"
              render={({ field }) => (
                <I.FormItem>
                  <I.FormLabel className="font-normal">
                    Add anything else you would like to share with CMS, limited
                    to 4000 characters
                  </I.FormLabel>
                  <I.Textarea {...field} className="h-[200px] resize-none" />
                  <I.FormDescription>
                    4,000 characters allowed
                  </I.FormDescription>
                </I.FormItem>
              )}
            />
          </SectionCard>
          <div className="my-2 w-5/6">
            <i>
              Once you submit this form, a confirmation email is sent to you and
              to CMS. CMS will use this content to review your package, and you
              will not be able to edit this form. If CMS needs any additional
              information, they will follow up by email. If you leave this page,
              you will lose your progress on this form.
            </i>
          </div>
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
            <I.Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="px-12"
            >
              Submit
            </I.Button>
            <I.Button
              type="button"
              variant="outline"
              onClick={() => setCancelModalIsOpen(true)}
              className="px-12"
            >
              Cancel
            </I.Button>

            {/* Success Modal */}
            <ConfirmationModal
              open={successModalIsOpen}
              onAccept={() => {
                setSuccessModalIsOpen(false);
                navigate(ROUTES.DASHBOARD);
              }}
              onCancel={() => setSuccessModalIsOpen(false)}
              title="Submission Successful"
              body={
                <p>
                  Please be aware that it may take up to a minute for your
                  submission to show in the Dashboard.
                </p>
              }
              cancelButtonVisible={false}
              acceptButtonText="Go to Dashboard"
            />

            {/* Cancel Modal */}
            <ConfirmationModal
              open={cancelModalIsOpen}
              onAccept={() => {
                setCancelModalIsOpen(false);
                navigate(ROUTES.DASHBOARD);
              }}
              onCancel={() => setCancelModalIsOpen(false)}
              cancelButtonText="Return to Form"
              acceptButtonText="Yes"
              title="Are you sure you want to cancel?"
              body={
                <p>
                  If you leave this page you will lose your progress on this
                  form
                </p>
              }
            />
          </div>
        </form>
      </I.Form>
    </SimplePageContainer>
  );
};
