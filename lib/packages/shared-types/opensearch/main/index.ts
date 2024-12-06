import { z } from "zod";
import { AggQuery, Filterable as FIL, Hit, QueryState, Response as Res } from "./../_";
import { ItemResult as Changelog } from "./../changelog";
import {
  appK,
  capitatedAmendment,
  capitatedInitial,
  capitatedRenewal,
  changedDate,
  contractingAmendment,
  contractingInitial,
  contractingRenewal,
  legacyPackageView,
  newChipSubmission,
  newMedicaidSubmission,
  respondToRai,
  seatool,
  temporaryExtension,
  toggleWithdrawRai,
  uploadSubsequentDocuments,
  withdrawPackage,
  withdrawRai,
} from "./transforms";

export type Document = (
  | (z.infer<capitatedAmendment.Schema> &
      z.infer<capitatedInitial.Schema> &
      z.infer<capitatedRenewal.Schema> &
      z.infer<contractingAmendment.Schema> &
      z.infer<contractingInitial.Schema> &
      z.infer<contractingRenewal.Schema> &
      z.infer<newChipSubmission.Schema> &
      z.infer<newMedicaidSubmission.Schema> &
      z.infer<temporaryExtension.Schema> &
      z.infer<legacyPackageView.Schema> &
      z.infer<respondToRai.Schema> &
      z.infer<withdrawRai.Schema> &
      z.infer<withdrawPackage.Schema> &
      z.infer<toggleWithdrawRai.Schema> &
      z.infer<appK.Schema> &
      z.infer<changedDate.Schema> &
      z.infer<uploadSubsequentDocuments.Schema>)
  | z.infer<seatool.Schema>
) & {
  makoChangedDate: string;
  changelog?: Changelog[];
  appkChildren?: Omit<ItemResult, "found">[];
};

export type Response = Res<Document>;
export type ItemResult = Hit<Document> & {
  found: boolean;
};

export type Field = keyof Document | `${keyof Document}.keyword`;
export type Filterable = FIL<Field>;
export type State = QueryState<Field>;
export type Aggs = AggQuery<Field>;

export * from "./transforms";

export const transforms = {
  "new-chip-submission": newChipSubmission,
  "new-medicaid-submission": newMedicaidSubmission,
  "capitated-initial": capitatedInitial,
  "capitated-amendment": capitatedAmendment,
  "capitated-renewal": capitatedRenewal,
  "contracting-amendment": contractingAmendment,
  "contracting-initial": contractingInitial,
  "contracting-renewal": contractingRenewal,
  "temporary-extension": temporaryExtension,
  "withdraw-package": withdrawPackage,
  "withdraw-rai": withdrawRai,
  "toggle-withdraw-rai": toggleWithdrawRai,
  "respond-to-rai": respondToRai,
  "app-k": appK,
  "upload-subsequent-documents": uploadSubsequentDocuments,
};
