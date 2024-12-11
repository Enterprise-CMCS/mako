import { Common, Search_RequestBody, TermQuery } from "@opensearch-project/opensearch";
import type { APIGatewayEventRequestContext, UserData, opensearch } from "shared-types";

// code borrowed from https://stackoverflow.com/questions/47914536/use-partial-in-nested-property-with-typescript
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type TestUserData = DeepPartial<UserData>;

export type TestItemResult = DeepPartial<opensearch.main.ItemResult>;

export type TestMainDocument = TestItemResult["_source"];

export type TestAppkItemResult = Omit<TestItemResult, "found">;

export type TestAppkDocument = TestAppkItemResult["_source"];

export type TestChangelogItemResult = DeepPartial<opensearch.changelog.ItemResult>;

export type TestChangelogDocument = TestChangelogItemResult["_source"];

export type TestCounty = [string, string, string];

export type IdpRequestSessionBody = {
  AccessToken: string;
};

export type IdpRefreshRequestBody = {
  ClientId: string;
  AuthFlow: "REFRESH_TOKEN_AUTH";
  AuthParameters: {
    REFRESH_TOKEN: string;
    DEVICE_KEY: null;
  };
};

export type IdpListUsersRequestBody = {
  UserPoolId: string;
  Filter: string;
};

export type SearchQueryBody = Search_RequestBody;

export type SearchTerm = Record<string, TermQuery | Common.FieldValue>;

export type EventRequestContext = Partial<APIGatewayEventRequestContext>;
