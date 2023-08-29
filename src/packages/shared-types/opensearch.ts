import { SeaToolTransform } from "./seatool";
import { OneMacTransform } from "./onemac";

export type OsHit<T> = {
  _index: string;
  _id: string;
  _score: number;
  _source: T;
  sort: Array<number>;
};
export type OsHits<T> = {
  hits: OsHit<T>[];
  max_score: number;
  total: { value: number; relation: "eq" };
};

export type OsResponse<T> = {
  _shards: {
    total: number;
    failed: number;
    successful: number;
    skipped: number;
  };
  hits: OsHits<T>;
  total: {
    value: number;
  };
  max_score: number | null;
  took: number;
  timed_out: boolean;
};

export type OsMainSourceItem = OneMacTransform & SeaToolTransform;
export type OsMainSearchResponse = OsResponse<OsMainSourceItem>;
export type SearchData = OsHits<OsMainSourceItem>;

export type OsFilterType =
  | "term"
  | "terms"
  | "match"
  | "range"
  | "search"
  | "global_search"
  | "exists";

export type OsRangeValue = { gte?: string; lte?: string };
export type OsFilterValue = string | string[] | number | boolean | OsRangeValue;
export type OsField =
  | keyof OsMainSourceItem
  | `${keyof OsMainSourceItem}.keyword`;

export type OsFilterable = {
  type: OsFilterType;
  field: OsField | "";
  value: OsFilterValue;
  prefix: "must" | "must_not" | "should" | "filter";
};

export type OsQueryState<T = any> = {
  sort: { field: OsField; order: "asc" | "desc" };
  pagination: { number: number; size: number };
  filters: OsFilterable[];
  search?: string;
  // buckets: Record<string, { label: string; value: string }[]>;
  // data: T[];
};

export type OsAggregateQuery = Record<
  string,
  { terms: { field: string; size: number } }
>;

export type OsAggregations = Record<
  string,
  {
    doc_count_error_upper_bound: number;
    sum_other_doc_count: 0;
    buckets: { key: string; doc_count: number }[];
  }
>;
