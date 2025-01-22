import { search } from "libs/opensearch-lib";
import { getDomainAndNamespace } from "libs/utils";

export const getNextSplitSPAId = async (spaId: string) => {
  const { domain, index } = getDomainAndNamespace("main");
  const query = {
    query: {
      regexp: {
        "id.keyword": `${spaId}-[a-zA-Z]`,
      },
    },
  };
  const matchingPackages = await search(domain, index, query);
  console.log(matchingPackages, "HELLOOO");
};
