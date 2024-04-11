import { Action, Authority } from "shared-types";
import { getSchemaFor } from "@/features/package-actions/lib/schemas";
import { getAttachmentsFor } from "@/features/package-actions/lib/attachments";
import { OneMacUser, submit } from "@/api";
import { buildActionUrl } from "@/utils";
import {
  BannerContent,
  Route,
  useAlertContext,
  useNavigate,
} from "@/components";
import { FieldValues } from "react-hook-form";
import { getContentFor } from "@/features/package-actions/lib/content";

type FormSetup = {
  schema: ReturnType<typeof getSchemaFor>;
  attachmentsSetup: ReturnType<typeof getAttachmentsFor>;
  content: ReturnType<typeof getContentFor>;
};
/** Builds a form setup using an Action x Authority 2-dimensional
 * lookup. */
export const getSetupFor = (a: Action, p: Authority): FormSetup => ({
  schema: getSchemaFor(a, p),
  attachmentsSetup: getAttachmentsFor(a, p),
  content: getContentFor(a, p),
});
/** Submits the given data to is corresponding Action endpoint, and centralizes
 * success/error handling. */
export const submitActionForm = async ({
  data,
  id,
  type,
  user,
  authority,
  alert,
  navigate,
  originRoute,
  successBannerContent,
}: {
  data: FieldValues;
  id: string;
  type: Action;
  user: OneMacUser;
  authority: Authority;
  originRoute: Route;
  alert: ReturnType<typeof useAlertContext>;
  navigate: ReturnType<typeof useNavigate>;
  successBannerContent: BannerContent;
}) => {
  try {
    await submit({
      data: { ...data, id: id },
      endpoint: buildActionUrl(type),
      user,
      authority: authority,
    });
    alert.setContent(successBannerContent);
    alert.setBannerStyle("success");
    alert.setBannerShow(true);
    alert.setBannerDisplayOn(originRoute);
    navigate({ path: originRoute });
  } catch (e: unknown) {
    console.error(e);
    alert.setContent({
      header: "An unexpected error has occurred:",
      body: e instanceof Error ? e.message : String(e),
    });
    alert.setBannerStyle("destructive");
    alert.setBannerDisplayOn(window.location.pathname as Route);
    alert.setBannerShow(true);
    window.scrollTo(0, 0);
  }
};
