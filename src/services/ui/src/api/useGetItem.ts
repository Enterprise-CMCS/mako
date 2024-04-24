import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { API } from "aws-amplify";
import { opensearch, ReactQueryApiError, SEATOOL_STATUS } from "shared-types";
import { useGetUser } from "./useGetUser";
import { getAvailableActions } from "shared-utils";

export const getItem = async (
  id: string,
): Promise<opensearch.main.ItemResult> =>
  await API.post("os", "/item", { body: { id } });

export const idIsApproved = async (id: string) => {
  try {
    const record = await getItem(id);
    return record._source.seatoolStatus == SEATOOL_STATUS.APPROVED;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const canBeRenewedOrAmended = async (id: string) => {
  try {
    const record = await getItem(id);
    return ["New", "Renew"].includes(record._source.actionType);
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const useGetItem = (
  id: string,
  options?: UseQueryOptions<opensearch.main.ItemResult, ReactQueryApiError>,
) => {
  return useQuery<opensearch.main.ItemResult, ReactQueryApiError>(
    ["record", id],
    () => getItem(id),
    options,
  );
};

export const useGetItemCache = (id: string) => {
  const queryClient = useQueryClient();
  const user = useGetUser();
  const data = (() => {
    const data = queryClient.getQueryCache().find(["record", id])?.state
      .data as opensearch.main.ItemResult;
    return data?._source;
  })();
  // const actions = getAvailableActions(user.data?.user, data)
  const actions = (() => {
    if (!user.data?.user) return [];
    return getAvailableActions(user.data?.user, data);
  })();

  const refetch = () => {
    queryClient.refetchQueries(["record", id]);
  };

  return { data, refetch, actions };
};
