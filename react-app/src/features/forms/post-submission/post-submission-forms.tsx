import { LoaderFunction, Navigate, useParams } from "react-router-dom";
import { Action, AuthorityUnion } from "shared-types";
import {
  WithdrawPackageAction,
  WithdrawPackageActionChip,
  WithdrawPackageActionWaiver,
} from "./withdraw-package";
import { RespondToRaiChip, RespondToRaiMedicaid, RespondToRaiWaiver } from "./respond-to-rai";
import { queryClient } from "../../../router";
import { getItem } from "@/api";
import { WithdrawRaiForm } from "./withdraw-rai";
import { DisableWithdrawRaiForm, EnableWithdrawRaiForm } from "./toggle-withdraw-rai";
import { TemporaryExtensionForm } from "../waiver/temporary-extension";

export const postSubmissionForms: Partial<
  Record<Action, Partial<Record<AuthorityUnion, () => React.ReactNode>>>
> = {
  "withdraw-package": {
    "1915(b)": WithdrawPackageActionWaiver,
    "1915(c)": WithdrawPackageActionWaiver,
    "Medicaid SPA": WithdrawPackageAction,
    "CHIP SPA": WithdrawPackageActionChip,
  },
  "respond-to-rai": {
    "1915(b)": RespondToRaiWaiver,
    "1915(c)": RespondToRaiWaiver,
    "Medicaid SPA": RespondToRaiMedicaid,
    "CHIP SPA": RespondToRaiChip,
  },
  "withdraw-rai": {
    "1915(b)": WithdrawRaiForm,
    "1915(c)": WithdrawRaiForm,
    "Medicaid SPA": WithdrawRaiForm,
    "CHIP SPA": WithdrawRaiForm,
  },
  "enable-rai-withdraw": {
    "1915(b)": EnableWithdrawRaiForm,
    "1915(c)": EnableWithdrawRaiForm,
    "Medicaid SPA": EnableWithdrawRaiForm,
    "CHIP SPA": EnableWithdrawRaiForm,
  },
  "disable-rai-withdraw": {
    "1915(b)": DisableWithdrawRaiForm,
    "1915(c)": DisableWithdrawRaiForm,
    "Medicaid SPA": DisableWithdrawRaiForm,
    "CHIP SPA": DisableWithdrawRaiForm,
  },
  "temporary-extension": {
    "1915(b)": TemporaryExtensionForm,
  },
};

export const PostSubmissionWrapper = () => {
  const { type, authority } = useParams<{ authority: AuthorityUnion; type: string }>();
  const PostSubmissionForm = postSubmissionForms?.[type]?.[authority];

  if (PostSubmissionForm === undefined) {
    return <Navigate to="/" />;
  }

  return <PostSubmissionForm />;
};

export const postSubmissionLoader: LoaderFunction = async ({ params }) => {
  return await queryClient.fetchQuery({
    queryKey: ["record", params.id],
    queryFn: async () => getItem(params.id),
  });
};
