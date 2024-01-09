import { z } from "zod";

export const toggleWithdrawRaiEnabledSchema = z.object({
  id: z.string(),
  authority: z.string(),
  origin: z.string(),
  raiWithdrawEnabled: z.boolean(),
  submitterName: z.string(),
  submitterEmail: z.string(),
});
export type ToggleWithdrawRaiEnabled = z.infer<
  typeof toggleWithdrawRaiEnabledSchema
>;

export const transformToggleWithdrawRaiEnabled = (id: string) => {
  return toggleWithdrawRaiEnabledSchema.transform((data) => ({
    id,
    raiWithdrawEnabled: data.raiWithdrawEnabled,
  }));
};
export type ToggleWithdrawRaiEnabledTransform = z.infer<
  ReturnType<typeof transformToggleWithdrawRaiEnabled>
>;
