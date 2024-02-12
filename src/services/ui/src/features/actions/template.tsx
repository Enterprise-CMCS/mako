import {
  ActionFormIntro,
  PackageInfo,
  SlotAdditionalInfo,
  SlotAttachments,
} from "@/features";
import {
  Form,
  Button,
  FormField,
  FormMessage,
  RequiredIndicator,
  Alert,
  LoadingSpinner,
  AttachmentsSizeTypesDesc,
  useModalContext,
} from "@/components";
import { ReactElement, ReactNode } from "react";
import { opensearch } from "shared-types";
import {
  FieldValues,
  Path,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { AttachmentRecipe } from "@/utils";
import { Info } from "lucide-react";

export const ActionFormTemplate = <D extends FieldValues>({
  item,
  formController,
  submitHandler,
  title,
  description,
  preSubmitMessage,
  attachments,
  attachmentFaqLink,
  attachmentInstructions,
  requireAddlInfo = false,
  addlInfoInstructions,
}: {
  item: opensearch.main.ItemResult;
  formController: UseFormReturn<D>;
  submitHandler: SubmitHandler<D>;
  title: string;
  description: ReactNode;
  preSubmitMessage?: string;
  attachments: AttachmentRecipe<D>[];
  attachmentFaqLink: string;
  attachmentInstructions?: ReactElement;
  requireAddlInfo?: boolean;
  addlInfoInstructions?: ReactElement;
}) => {
  const { setCancelModalOpen } = useModalContext();
  return (
    <Form {...formController}>
      <form onSubmit={formController.handleSubmit(submitHandler)}>
        {formController.formState.isSubmitting && <LoadingSpinner />}
        <ActionFormIntro title={title}>
          <RequiredIndicator /> Indicates a required field
          {description}
        </ActionFormIntro>
        <PackageInfo item={item} />
        <h3 className="font-bold text-2xl font-sans">Attachments</h3>
        {attachmentInstructions}
        <AttachmentsSizeTypesDesc faqLink={attachmentFaqLink} />
        {attachments.map(({ name, label, required }) => (
          <FormField
            key={String(name)}
            control={formController.control}
            name={`attachments.${String(name)}` as Path<D>}
            render={SlotAttachments({
              label: (
                <>
                  {label}
                  {required ? <RequiredIndicator /> : ""}
                </>
              ),
              message: <FormMessage />,
              className: "my-4",
            })}
          />
        ))}
        <FormField
          control={formController.control}
          name={"additionalInformation" as Path<D>}
          render={SlotAdditionalInfo({
            label: addlInfoInstructions,
            description: "4,000 characters allowed",
            className: "pt-6",
            required: requireAddlInfo,
          })}
        />
        {Object.keys(formController.formState.errors).length !== 0 && (
          <Alert className="my-6" variant="destructive">
            Input validation error(s)
            <ul className="list-disc">
              {Object.values(formController.formState.errors).map(
                (err, idx) =>
                  err?.message && (
                    <li className="ml-8 my-2" key={idx}>
                      {err.message as string}
                    </li>
                  )
              )}
            </ul>
          </Alert>
        )}
        {preSubmitMessage && (
          <Alert variant={"infoBlock"} className="my-2 w-full flex-row text-sm">
            <Info />
            <p className="ml-2">{preSubmitMessage}</p>
          </Alert>
        )}
        <div className="flex gap-2 my-8">
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            onClick={() => setCancelModalOpen(true)}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
