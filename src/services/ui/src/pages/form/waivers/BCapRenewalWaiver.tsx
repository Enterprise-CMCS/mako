import { useForm } from "react-hook-form";
import { z } from "zod";
import { opensearch, PlanType } from "shared-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionSubmitHandler } from "@/hooks/useActionFormController";
import { SubmissionFormTemplate } from "@/pages/form/template";
import { ModalProvider } from "@/pages/form/modals";
import { BreadCrumbs, SimplePageContainer } from "@/components";
import setupBCapRenewalWaiver from "@/pages/form/waivers/setups/setupBCapRenewalWaiver";
import { formCrumbsFromPath } from "@/pages/form/form-breadcrumbs";

export const Form = ({ item }: { item?: opensearch.main.ItemResult }) => {
  const { schema, attachments } = setupBCapRenewalWaiver;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const handleSubmit = useActionSubmitHandler<z.infer<typeof schema>>({
    formHookReturn: form,
    authority: "" as PlanType,
  });

  return (
    <SubmissionFormTemplate<z.infer<typeof schema>>
      formController={form}
      submitHandler={handleSubmit}
      title={"Formal RAI Details"}
      description={<p className="font-light mb-6 max-w-4xl"></p>}
      preSubmitMessage={""}
      attachments={attachments}
      attachmentFaqLink={"/faq"}
      requireAddlInfo
      addlInfoInstructions={<></>}
    />
  );
};

export const BCapRenewalWaiver = () => (
  <ModalProvider>
    <SimplePageContainer>
      <BreadCrumbs options={formCrumbsFromPath(location.pathname)} />
      <Form />
    </SimplePageContainer>
  </ModalProvider>
);
