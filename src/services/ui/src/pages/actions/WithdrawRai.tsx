import { ConfirmationModal } from "@/components";
import * as I from "@/components/Inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "@/components/Routing";
import { opensearch, PlanType } from "shared-types";
import { useState } from "react";
import { ActionFormTemplate } from "@/pages/actions/template";
import { useActionSubmitHandler } from "@/hooks/useActionFormController";
import { ActionFormIntro } from "@/pages/actions/common";
import { FormSetup } from "@/pages/actions/setups";

export const WithdrawRai = ({
  item,
  schema,
  attachments,
}: FormSetup & { item: opensearch.main.ItemResult }) => {
  const { id } = useParams("/action/:id/:type");
  const [areYouSureModalOpen, setAreYouSureModalOpen] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const handleSubmit = useActionSubmitHandler<z.infer<typeof schema>>({
    formHookReturn: form,
    authority: item?._source.authority as PlanType,
    addDataConditions: [
      // This rule is accommodating a bespoke confirmation modal need.
      // It'll be worth revising when we do Banners and Modal updates.
      () => {
        setAreYouSureModalOpen(true);
        return { message: "Awaiting confirmation" }; // Only a console log message
      },
    ],
  });

  return (
    <>
      <ActionFormTemplate<z.infer<typeof schema>>
        item={item}
        formController={form}
        submitHandler={handleSubmit}
        intro={
          <ActionFormIntro title={"Withdraw Formal RAI Response Details"}>
            <I.RequiredIndicator /> Indicates a required field
            <p className="font-light mb-6 max-w-4xl">
              Complete this form to withdraw the Formal RAI response. Once
              complete, you and CMS will receive an email confirmation.
            </p>
          </ActionFormIntro>
        }
        attachments={attachments}
        attachmentFaqLink={"/faq/#medicaid-spa-rai-attachments"}
      />

      {/* TODO: Clean up implementation of modal */}

      <ConfirmationModal
        open={areYouSureModalOpen}
        onAccept={() => {
          setAreYouSureModalOpen(false);
          // Continues the submission process using the same exact handler
          form.handleSubmit(handleSubmit)();
        }}
        onCancel={() => {
          setAreYouSureModalOpen(false);
        }}
        title="Withdraw Formal RAI Response?"
        body={`You are about to withdraw the Formal RAI Response for ${id}. CMS will be notified.`}
        acceptButtonText="Yes, withdraw response"
        cancelButtonText="Cancel"
      />
    </>
  );
};
