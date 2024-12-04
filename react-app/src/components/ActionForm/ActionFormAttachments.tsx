import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredIndicator,
  SectionCard,
  Upload,
} from "@/components";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import {
  AttachmentFAQInstructions,
  AttachmentFileFormatInstructions,
  AttachmentInstructions,
} from "./actionForm.components";

export type AttachmentsOptions = {
  title?: string;
  requiredIndicatorForTitle?: boolean;
  instructions?: JSX.Element[];
  callout?: string;
  faqLink?: string;
};

type ActionFormAttachmentsProps = {
  attachmentsFromSchema: [string, z.ZodObject<z.ZodRawShape, "strip">][];
} & AttachmentsOptions;

export const ActionFormAttachments = ({
  attachmentsFromSchema,
  title = "Attachments",
  faqLink,
  requiredIndicatorForTitle,
  instructions,
  callout,
}: ActionFormAttachmentsProps) => {
  const form = useFormContext();

  const attachmentInstructions = instructions ?? [
    <AttachmentFileFormatInstructions />,
    <AttachmentFAQInstructions faqLink={faqLink} />,
  ];

  return (
    <SectionCard
      title={
        <>
          {title} {requiredIndicatorForTitle && <RequiredIndicator />}
        </>
      }
    >
      <div>
        {callout && (
          <>
            <p className="font-medium">{callout}</p>
            <br />
          </>
        )}
        {attachmentInstructions.map((instruction, i) => (
          <div key={i}>
            {instruction}
            {i < attachmentInstructions.length - 1 && <br />}
          </div>
        ))}
      </div>
      <section className="space-y-8" data-testid="attachments-section">
        {attachmentsFromSchema.map(([key, value]) => (
          <FormField
            key={key}
            control={form.control}
            name={`attachments.${key}.files`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold" data-testid={`${key}-label`}>
                  {value.shape.label._def.defaultValue()}{" "}
                  {value.shape.files instanceof z.ZodOptional ? null : <RequiredIndicator />}
                </FormLabel>
                <AttachmentInstructions fileValidation={value.shape.files._def} />
                <Upload files={field.value ?? []} setFiles={field.onChange} dataTestId={key} />
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </section>
    </SectionCard>
  );
};
