import { search } from "libs/opensearch-lib";
import { getDomainAndNamespace } from "libs/utils";

export const getNextSplitSPAId = async (spaId: string) => {
  const { domain, index } = getDomainAndNamespace("main");
  const query = {
    regexp: {
      id: `${spaId}-[a-zA-Z]`,
    },
  };
  const matchingPackages = search(domain, index, query);
  console.log(matchingPackages, "HELLOOO");
};
