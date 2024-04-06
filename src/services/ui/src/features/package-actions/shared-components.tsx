import {
  Alert,
  LoadingSpinner,
  Route,
  useAlertContext,
  useModalContext,
} from "@/components";
import {
  Button,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredIndicator,
  Textarea,
  Upload,
} from "@/components/Inputs";
import { FAQ_TAB } from "@/components/Routing/consts";
import { useEffect } from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import {
  ActionFunctionArgs,
  Link,
  useActionData,
  useLocation,
  useNavigate,
  useNavigation,
  useSubmit,
  useParams,
} from "react-router-dom";
import { Authority } from "shared-types";

// Components

export const RequiredFieldDescription = () => {
  return (
    <>
      <span className="text-red-500">*</span> Indicates a required field
    </>
  );
};

export const ActionDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="font-light mb-6 max-w-4xl">{children}</div>;
};

export const Heading = ({ title }: { title: string }) => {
  return <h1 className="text-2xl font-semibold mt-4 mb-2">{title}</h1>;
};

export const AttachmentsSection = <T extends string>({
  attachments,
  supportingInformation,
}: {
  attachments: { name: string; required: boolean; registerName: T }[];
  supportingInformation?: string;
}) => {
  const form = useFormContext();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const segment = pathSegments[3]; // 'chip' | 'mediaid

  return (
    <>
      <h2 className="font-bold text-2xl font-sans mb-2">Attachments</h2>
      {supportingInformation && <p>{supportingInformation}</p>}
      <p>
        Maximum file size of 80 MB per attachment. You can add multiple files
        per attachment type. Read the description for each of the attachment
        types on the
        <Link
          className="text-blue-700 hover:underline"
          to={`/faq/${segment}-spa-attachments`}
          target={FAQ_TAB}
          rel="noopener noreferrer"
        >
          {" "}
          FAQ Page.
        </Link>
      </p>
      <p>
        We accept the following file formats:{"  "}
        <strong>.docx, .jpg, .pdf, .png, .xlsx. </strong>
        See the full list on the{" "}
        <Link
          className="text-blue-700 hover:underline"
          to={"/faq/acceptable-file-formats"}
          target={FAQ_TAB}
          rel="noopener noreferrer"
        >
          {" "}
          FAQ Page.
        </Link>
      </p>
      {attachments.map(({ name, required, registerName }) => (
        <FormField
          key={name}
          control={form.control}
          name={`attachments.${registerName}`}
          render={({ field }) => (
            <FormItem key={name} className="my-4 space-y-2">
              <FormLabel>{name}</FormLabel> {required && <RequiredIndicator />}
              <Upload files={field?.value ?? []} setFiles={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
};

export const SubmissionButtons = ({ onSubmit }: { onSubmit?: () => void }) => {
  const { state } = useNavigation();
  const modal = useModalContext();
  const navigate = useNavigate();

  const acceptAction = () => {
    modal.setModalOpen(false);
    navigate(-1);
  };

  return (
    <section className="space-x-2 mb-8">
      <Button
        type={onSubmit ? "button" : "submit"}
        onClick={onSubmit}
        disabled={state === "submitting"}
      >
        Submit
      </Button>
      <Button
        onClick={() => {
          modal.setContent({
            header: "Stop form submission?",
            body: "All information you've entered on this form will be lost if you leave this page.",
            acceptButtonText: "Yes, leave form",
            cancelButtonText: "Return to form",
          });

          modal.setOnAccept(() => acceptAction);

          modal.setModalOpen(true);
        }}
        variant={"outline"}
        type="reset"
        disabled={state === "submitting"}
      >
        Cancel
      </Button>
    </section>
  );
};

export const PackageSection = () => {
  const { authority, id } = useParams() as { authority: Authority; id: string };
  const lcAuthority = authority.toLowerCase();
  // We should pass in the already lowercased Authority, right?  todo
  return (
    <section className="flex flex-col my-8 space-y-8">
      <div>
        <p>
          {[Authority.CHIP_SPA, Authority.MED_SPA].includes(
            authority.toLowerCase() as Authority,
          ) && "Package ID"}
          {[Authority["1915b"], Authority["1915c"]].includes(
            authority.toLowerCase() as Authority,
          ) && "Waiver Number"}
        </p>
        <p className="text-xl">{id}</p>
      </div>
      <div>
        <p>Authority</p>
        <p className="text-xl">
          {lcAuthority === Authority["1915b"] && "1915(b) Waiver"}
          {lcAuthority === Authority["1915c"] && "1915(c) Waiver"}
          {lcAuthority === Authority["CHIP_SPA"] && "CHIP SPA"}
          {lcAuthority === Authority["MED_SPA"] && "Medicaid SPA"}
        </p>
      </div>
    </section>
  );
};

export const AdditionalInformation = ({
  helperText = "Add anything else that you would like to share with the State.",
  required = true,
}: {
  helperText?: string;
  required?: boolean;
}) => {
  const form = useFormContext();

  return (
    <section className="my-4">
      <h2 className="font-bold text-2xl font-sans mb-2">
        Additional Information {required && <RequiredIndicator />}
      </h2>
      <FormField
        control={form.control}
        name="additionalInformation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <p>{helperText}</p>
            </FormLabel>
            <Textarea {...field} className="h-[200px] resize-none" />
            <FormMessage />
            <FormDescription>4,000 characters allowed</FormDescription>
          </FormItem>
        )}
      />
    </section>
  );
};

export const ErrorBanner = () => {
  const form = useFormContext();

  return (
    <>
      {Object.keys(form.formState.errors).length !== 0 && (
        <Alert className="my-6" variant="destructive">
          Input validation error(s)
          <ul className="list-disc">
            {Object.values(form.formState.errors).map(
              (err, idx) =>
                err?.message && (
                  <li className="ml-8 my-2" key={idx}>
                    {err.message as string}
                  </li>
                ),
            )}
          </ul>
        </Alert>
      )}
    </>
  );
};

export const FormLoadingSpinner = () => {
  const { state } = useNavigation();
  const { formState } = useFormContext();
  return (
    (state === "submitting" || formState.isSubmitting) && <LoadingSpinner />
  );
};

// Hooks

export const useSubmitForm = () => {
  const methods = useFormContext();
  const submit = useSubmit();
  const location = useLocation();

  const validSubmission: SubmitHandler<any> = (data, e) => {
    const formData = new FormData();
    // Append all other data
    for (const key in data) {
      if (key !== "attachments") {
        formData.append(key, data[key]);
      }
    }
    const attachments =
      Object.keys(filterUndefinedValues(data.attachments)).length > 0
        ? data.attachments
        : {};
    for (const key in attachments) {
      attachments[key]?.forEach((file: any, index: number) => {
        formData.append(`attachments.${key}.${index}`, file as any);
      });
    }

    submit(formData, {
      method: "post",
      encType: "multipart/form-data",
      state: location.state,
    });
  };

  return {
    handleSubmit: methods.handleSubmit(validSubmission),
    formMethods: methods,
  };
};

export const useIntakePackage = () => {
  const methods = useFormContext();
  const submit = useSubmit();
  const location = useLocation();

  const validSubmission: SubmitHandler<any> = (data, e) => {
    submit(data, {
      method: "post",
      encType: "application/json",
      state: location.state,
    });
  };

  return {
    handleSubmit: methods.handleSubmit(validSubmission),
    formMethods: methods,
  };
};

export const useDisplaySubmissionAlert = (header: string, body: string) => {
  const alert = useAlertContext();
  const data = useActionData() as ActionFunctionReturnType;
  const navigate = useNavigate();
  const location = useLocation();

  return useEffect(() => {
    if (data?.submitted) {
      alert.setContent({
        header,
        body,
      });
      alert.setBannerStyle("success");
      alert.setBannerShow(true);
      if (location.pathname?.endsWith("/update-id")) {
        alert.setBannerDisplayOn("/dashboard");
        navigate("/dashboard");
      } else {
        alert.setBannerDisplayOn(
          location.state?.from?.split("?")[0] ?? "/dashboard",
        );
        navigate(location.state?.from ?? "/dashboard");
      }
    } else if (!data?.submitted && data?.error) {
      alert.setContent({
        header: "An unexpected error has occurred:",
        body:
          data.error instanceof Error ? data.error.message : String(data.error),
      });
      alert.setBannerStyle("destructive");
      alert.setBannerDisplayOn(window.location.pathname as Route);
      alert.setBannerShow(true);
      window.scrollTo(0, 0);
    }
  }, [data, alert, navigate, location.state, location.pathname]);
};

// Utility Functions
const filterUndefinedValues = (obj: Record<any, any>) => {
  if (obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value !== undefined),
    );
  }
  return {};
};

// Types
export type ActionFunction = (
  args: ActionFunctionArgs,
) => Promise<{ submitted: boolean; error?: Error | unknown }>;
export type ActionFunctionReturnType = Awaited<ReturnType<ActionFunction>>;
