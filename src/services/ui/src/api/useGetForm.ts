import { useQuery } from "@tanstack/react-query";
import { API } from "aws-amplify";
import { OsHit, OsMainSourceItem, ReactQueryApiError } from "shared-types";

export const getForm = async (
  formId: string,
  formVersion?: number
): Promise<OsHit<OsMainSourceItem>> => {
  const form = await API.post("os", "/forms", {
    body: { formId, formVersion },
  });

  return form;
};

export const useGetForm = (id: string, formVersion?: number) => {
  return useQuery<OsHit<OsMainSourceItem>, ReactQueryApiError>(
    ["formID", id],
    () => getForm(id, formVersion)
  );
};
