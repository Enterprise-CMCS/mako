import { API } from "aws-amplify";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ReactQueryApiError } from "shared-types";
import { z } from "zod";
import { STATES } from "@/consts";

export const submissionApiSchema = z.object({
  id: z
    .string()
    .regex(
      /^[A-Z]{2}-[0-9]{2}-[0-9]{4}(-[0-9]{4})?$/g,
      "ID doesn't match format SS-YY-NNNN or SS-YY-NNNN-xxxx"
    ),
  authority: z.string(),
  state: z
    .string()
    .refine((arg) => STATES.includes(arg), "State from ID is invalid"),
  additionalInformation: z.string().max(4000),
  attachments: z.array(z.object({})),
  raiResponses: z.array(z.object({})),
  origin: z.string(),
  submitterEmail: z.string().email(),
  submitterName: z.string(),
});
export type SubmissionAPIBody = z.infer<typeof submissionApiSchema>;

export const postSubmissionData = async (
  props: SubmissionAPIBody
): Promise<any> => {
  const results = await API.post("os", "/submit", {
    body: props,
  });
  console.log(results);
  return results;
};

export const useSubmissionMutation = (
  options?: UseMutationOptions<any, ReactQueryApiError, SubmissionAPIBody>
) => {
  return useMutation<any, ReactQueryApiError, SubmissionAPIBody>(
    (props) => postSubmissionData(props),
    options
  );
};
