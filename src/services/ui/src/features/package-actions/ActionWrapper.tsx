import { FormProvider, useForm } from "react-hook-form";
import { Outlet, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import { BreadCrumbs, SimplePageContainer } from "@/components";
import { detailsAndActionsCrumbs } from "@/features";
import { Action } from "shared-types";
import { useParams } from "@/components/Routing";
import { tempExtensionSchema } from "./TemporaryExtension";

const schemas = {
  "temporary-extension": tempExtensionSchema,
} satisfies Record<string, ZodSchema<any>>;
type SchemaKeys = keyof typeof schemas;

const actions: Record<SchemaKeys, Action> = {
  "temporary-extension": Action.TEMP_EXTENSION,
};

export const ActionWrapper = () => {
  const location = useLocation();
  const packageActionType = location.pathname.split("/").pop() as SchemaKeys;

  const { id } = useParams("/action/:authority/:id/:type");

  const methods = useForm({
    resolver: zodResolver(schemas[packageActionType!]),
  });

  return (
    <SimplePageContainer>
      <BreadCrumbs
        options={detailsAndActionsCrumbs({
          id,
          action: actions[packageActionType],
        })}
      />
      <FormProvider {...methods}>
        <Outlet />
      </FormProvider>
    </SimplePageContainer>
  );
};
