import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API } from "aws-amplify";
import { ReactQueryApiError } from "shared-types";

export type SearchData = {
  _index: string;
  _id: string;
  _score: number;
  _source: any;
};

export const getSearchData = async (
  selectedState: string,
  searchString: string,
  programType: string
): Promise<{ hits: SearchData[] }> => {
  const query: any = {
    from: 0,
    size: 100,
    query: {
      bool: {
        must: [
          {
            match: {
              programType: {
                query: programType,
              },
            },
          },
        ],
      },
    },
  };
  if (searchString) {
    query.query.bool.must = [
      {
        match_phrase: {
          id: `${searchString}`,
        },
      },
    ];
  } else {
    // If we haven't specified any parameters, lets just sort by changed date
    query.sort = [
      {
        changedDate: {
          order: "desc",
        },
      },
    ];
  }
  const searchData = await API.post("os", "/search", {
    body: query,
  });

  return searchData;
};

export const useSearch = (
  options?: UseMutationOptions<
    { hits: SearchData[] },
    ReactQueryApiError,
    { selectedState: string; searchString: string; programType: string }
  >
) => {
  return useMutation<
    { hits: SearchData[] },
    ReactQueryApiError,
    { selectedState: string; searchString: string; programType: string }
  >(
    (props) =>
      getSearchData(props.selectedState, props.searchString, props.programType),
    options
  );
};
