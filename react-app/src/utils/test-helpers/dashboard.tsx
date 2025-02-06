import { expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { BLANK_VALUE } from "@/consts";
import LZ from "lz-string";
import React, { ReactElement } from "react";
import {
  ContextState,
  OsTableColumn,
  OsUrlState,
  OsProvider,
  FilterDrawerProvider,
} from "@/components";
import {
  opensearch,
  SEATOOL_STATUS,
  statusToDisplayToCmsUser,
  statusToDisplayToStateUser,
} from "shared-types";
import { getFilteredItemList } from "mocks";
import { renderWithQueryClientAndMemoryRouter } from "./render";

export const DEFAULT_COLUMNS: OsTableColumn[] = [
  {
    props: { className: "w-[150px]" },
    field: "id.keyword",
    label: "SPA ID",
    locked: true,
    transform: (data) => data.id ?? BLANK_VALUE,
    cell: (data) => data.id ?? BLANK_VALUE,
  },
  {
    field: "state.keyword",
    label: "State",
    transform: (data) => data.state ?? BLANK_VALUE,
    cell: (data) => data.state ?? BLANK_VALUE,
  },
  {
    field: "authority.keyword",
    label: "Authority",
    transform: (data) => data.authority ?? BLANK_VALUE,
    cell: (data) => data.authority ?? BLANK_VALUE,
  },
];

export const HIDDEN_COLUMN: OsTableColumn = {
  field: "origin.keyword",
  label: "Submission Source",
  hidden: true,
  transform: (data) => data.origin ?? BLANK_VALUE,
  cell: (data) => data.origin ?? BLANK_VALUE,
};

export const NO_TRANSFORM_COLUMN: OsTableColumn = {
  field: "raiReceivedDate",
  label: "Formal RAI Response",
  cell: (data) => data.raiReceivedDate ?? BLANK_VALUE,
};

export const NO_FIELD_COLUMN: OsTableColumn = {
  label: "Latest Package Activity",
  transform: (data) => data.makoChangedDate ?? BLANK_VALUE,
  cell: (data) => data.makoChangedDate ?? BLANK_VALUE,
};

export const DEFAULT_FILTERS: opensearch.Filterable<opensearch.main.Field>[] = [
  {
    label: "State",
    field: "state.keyword",
    component: "multiSelect",
    prefix: "must",
    type: "terms",
    value: ["MD"],
  },
  {
    label: "Authority",
    field: "authority.keyword",
    component: "multiCheck",
    prefix: "must",
    type: "terms",
    value: ["CHIP SPA"],
  },
  {
    label: "RAI Withdraw Enabled",
    field: "raiWithdrawEnabled",
    component: "boolean",
    prefix: "must",
    type: "match",
    value: true,
  },
  {
    label: "Final Disposition",
    field: "finalDispositionDate",
    component: "dateRange",
    prefix: "must",
    type: "range",
    value: {
      gte: "2025-01-01T00:00:00.000Z",
      lte: "2025-01-01T23:59:59.999Z",
    },
  },
];

export const EMPTY_HITS: opensearch.Hits<opensearch.main.Document> = {
  hits: [],
  max_score: 5,
  total: { value: 0, relation: "eq" },
};

export const getFilteredHits = (
  authorities: string[],
): opensearch.Hits<opensearch.main.Document> => {
  const items = getFilteredItemList(authorities).map(
    (item) => ({ ...item, found: undefined }) as opensearch.Hit<opensearch.main.Document>,
  );
  return {
    hits: items,
    max_score: 5,
    total: { value: items.length, relation: "eq" },
  };
};

export const URL_CODE = "094230fe-a02f-45d7-a675-05876ab5d76a";

export const getDashboardQueryString = ({
  filters,
  search,
  tab,
  pagination,
  sort,
}: Partial<OsUrlState> = {}) => {
  const queryString = LZ.compressToEncodedURIComponent(
    JSON.stringify({
      filters: filters || [],
      search: search || "",
      tab: tab || "spas",
      pagination: pagination || {
        number: 0,
        size: 25,
      },
      sort: sort || {
        field: "submissionDate",
        order: "desc",
      },
      URL_CODE,
    }),
  );
  return queryString;
};

export const renderDashboard = (element: ReactElement, value: ContextState, queryString: string) =>
  renderWithQueryClientAndMemoryRouter(
    element,
    [
      {
        path: "/dashboard",
        element: (
          <OsProvider value={value}>
            <FilterDrawerProvider>{element}</FilterDrawerProvider>
          </OsProvider>
        ),
      },
    ],
    {
      initialEntries: [
        {
          pathname: "/dashboard",
          search: `code=${URL_CODE}&os=${queryString}`,
        },
      ],
    },
  );

export const renderFilterDrawer = (element: ReactElement, queryString: string) => {
  return renderWithQueryClientAndMemoryRouter(
    element,
    [
      {
        path: "/dashboard",
        element: <FilterDrawerProvider>{element}</FilterDrawerProvider>,
      },
    ],
    {
      initialEntries: [
        {
          pathname: "/dashboard",
          search: `code=${URL_CODE}&os=${queryString}`,
        },
      ],
    },
  );
};

export const verifyFiltering = (hiddenCount: number = 0) => {
  const filtering = screen.getByTestId("filtering");
  const search = within(filtering).queryByLabelText(
    "Search by Package ID, CPOC Name, or Submitter Name",
  );
  expect(search).toBeInTheDocument();
  expect(search).toBeEnabled();

  expect(
    within(filtering).queryByRole("button", {
      name: hiddenCount === 0 ? "Columns" : `Columns (${hiddenCount} hidden)`,
    }),
  ).toBeInTheDocument();
  expect(within(filtering).queryByRole("button", { name: "Filters" })).toBeInTheDocument();

  const exportBtn = within(filtering).queryByRole("button", { name: "Export" });
  expect(exportBtn).toBeInTheDocument();
  expect(exportBtn).toBeEnabled();
};

export const verifyChips = (labels: string[]) => {
  if (labels.length === 0) {
    expect(screen.getByTestId("chips").childElementCount).toEqual(0);
  } else {
    const chips = screen.getByTestId("chips");
    labels.forEach((label) => {
      expect(within(chips).getByText(label)).toBeInTheDocument();
    });
  }
};

export const verifyPagination = (recordCount: number) => {
  const pagination = screen.getByTestId("pagination");
  expect(within(screen.getByTestId("pagination")).getByLabelText("Records per page:")).toHaveValue(
    "25",
  );
  expect(within(pagination).getByTestId("page-location").textContent).toEqual(
    `1-${recordCount < 25 ? recordCount : 25}of${recordCount}records`,
  );
  expect(within(pagination).getByLabelText("Pagination")).toBeInTheDocument();
};

export const BASE_ITEM = {
  state: "MD",
  origin: "OneMAC",
  submissionDate: "2024-01-01T00:00:00.000Z",
  makoChangedDate: "2024-02-01T00:00:00.000Z",
  changedDate: "2024-03-01T00:00:00.000Z",
};

export const PENDING_SUBMITTED_ITEM = {
  _id: "MD-01-2024",
  _source: {
    ...BASE_ITEM,
    id: "MD-01-2024",
    seatoolStatus: SEATOOL_STATUS.PENDING,
    cmsStatus: statusToDisplayToCmsUser[SEATOOL_STATUS.PENDING],
    stateStatus: statusToDisplayToStateUser[SEATOOL_STATUS.PENDING],
    submitterName: "Alice Anderson",
    leadAnalystName: "Beth Bernard",
  },
};

export const PENDING_SUBMITTED_ITEM_EXPORT = {
  "Formal RAI Response": "-- --",
  "Initial Submission": "01/01/2024",
  "Latest Package Activity": "02/01/2024",
  State: PENDING_SUBMITTED_ITEM._source.state,
  "Submitted By": PENDING_SUBMITTED_ITEM._source.submitterName,
  "CPOC Name": PENDING_SUBMITTED_ITEM._source.leadAnalystName,
  "Final Disposition": "-- --",
  "Formal RAI Requested": "-- --",
  "Submission Source": "OneMAC",
};

export const PENDING_RAI_REQUEST_ITEM = {
  _id: "MD-02-2024",
  _source: {
    ...BASE_ITEM,
    id: "MD-02-2024",
    seatoolStatus: SEATOOL_STATUS.PENDING_RAI,
    cmsStatus: statusToDisplayToCmsUser[SEATOOL_STATUS.PENDING_RAI],
    stateStatus: statusToDisplayToStateUser[SEATOOL_STATUS.PENDING_RAI],
    raiRequestedDate: "2024-03-01T00:00:00.000Z",
    submitterName: "Carl Carson",
    leadAnalystName: "Dan Davis",
  },
};

export const PENDING_RAI_REQUEST_ITEM_EXPORT = {
  "Formal RAI Response": "-- --",
  "Initial Submission": "01/01/2024",
  "Latest Package Activity": "02/01/2024",
  State: PENDING_RAI_REQUEST_ITEM._source.state,
  "Submitted By": PENDING_RAI_REQUEST_ITEM._source.submitterName,
  "CPOC Name": PENDING_RAI_REQUEST_ITEM._source.leadAnalystName,
  "Final Disposition": "-- --",
  "Formal RAI Requested": "03/01/2024",
  "Submission Source": "OneMAC",
};

export const PENDING_RAI_RECEIVED_ITEM = {
  _id: "MD-03-2024",
  _source: {
    ...BASE_ITEM,
    id: "MD-03-2024",
    seatoolStatus: SEATOOL_STATUS.PENDING,
    cmsStatus: statusToDisplayToCmsUser[SEATOOL_STATUS.PENDING],
    stateStatus: statusToDisplayToStateUser[SEATOOL_STATUS.PENDING],
    raiRequestedDate: "2024-03-01T00:00:00.000Z",
    raiReceivedDate: "2024-04-01T00:00:00.000Z",
    submitterName: "Ethan Evans",
    leadAnalystName: "Fran Foster",
  },
};

export const PENDING_RAI_RECEIVED_ITEM_EXPORT = {
  "Formal RAI Response": "04/01/2024",
  "Initial Submission": "01/01/2024",
  "Latest Package Activity": "02/01/2024",
  State: PENDING_RAI_RECEIVED_ITEM._source.state,
  "Submitted By": PENDING_RAI_RECEIVED_ITEM._source.submitterName,
  "CPOC Name": PENDING_RAI_RECEIVED_ITEM._source.leadAnalystName,
  "Final Disposition": "-- --",
  "Formal RAI Requested": "03/01/2024",
  "Submission Source": "OneMAC",
};

export const RAI_WITHDRAW_ENABLED_ITEM = {
  _id: "MD-04-2024",
  _source: {
    ...BASE_ITEM,
    id: "MD-04-2024",
    seatoolStatus: SEATOOL_STATUS.PENDING,
    cmsStatus: statusToDisplayToCmsUser[SEATOOL_STATUS.PENDING],
    stateStatus: statusToDisplayToStateUser[SEATOOL_STATUS.PENDING],
    raiRequestedDate: "2024-03-01T00:00:00.000Z",
    raiReceivedDate: "2024-04-01T00:00:00.000Z",
    submitterName: "Graham Greggs",
    leadAnalystName: "Henry Harrison",
    raiWithdrawEnabled: true,
  },
};

export const RAI_WITHDRAW_ENABLED_ITEM_EXPORT = {
  "Formal RAI Response": "04/01/2024",
  "Initial Submission": "01/01/2024",
  "Latest Package Activity": "02/01/2024",
  State: RAI_WITHDRAW_ENABLED_ITEM._source.state,
  "Submitted By": RAI_WITHDRAW_ENABLED_ITEM._source.submitterName,
  "CPOC Name": RAI_WITHDRAW_ENABLED_ITEM._source.leadAnalystName,
  "Final Disposition": "-- --",
  "Formal RAI Requested": "03/01/2024",
  "Submission Source": "OneMAC",
};

export const RAI_WITHDRAW_DISABLED_ITEM = {
  _id: "MD-05-2024",
  _source: {
    ...BASE_ITEM,
    id: "MD-05-2024",
    seatoolStatus: SEATOOL_STATUS.PENDING,
    cmsStatus: statusToDisplayToCmsUser[SEATOOL_STATUS.PENDING],
    stateStatus: statusToDisplayToStateUser[SEATOOL_STATUS.PENDING],
    raiRequestedDate: "2024-03-01T00:00:00.000Z",
    raiReceivedDate: "2024-04-01T00:00:00.000Z",
    submitterName: "Isaac Irwin",
    leadAnalystName: "Jack Jefferson",
    raiWithdrawEnabled: false,
  },
};

export const RAI_WITHDRAW_DISABLED_ITEM_EXPORT = {
  "Formal RAI Response": "04/01/2024",
  "Initial Submission": "01/01/2024",
  "Latest Package Activity": "02/01/2024",
  State: RAI_WITHDRAW_DISABLED_ITEM._source.state,
  "Submitted By": RAI_WITHDRAW_DISABLED_ITEM._source.submitterName,
  "CPOC Name": RAI_WITHDRAW_DISABLED_ITEM._source.leadAnalystName,
  "Final Disposition": "-- --",
  "Formal RAI Requested": "03/01/2024",
  "Submission Source": "OneMAC",
};

export const APPROVED_ITEM = {
  _id: "MD-06-2024",
  _source: {
    ...BASE_ITEM,
    id: "MD-06-2024",
    seatoolStatus: SEATOOL_STATUS.PENDING,
    cmsStatus: statusToDisplayToCmsUser[SEATOOL_STATUS.PENDING],
    stateStatus: statusToDisplayToStateUser[SEATOOL_STATUS.PENDING],
    finalDispositionDate: "05/01/2024",
    submitterName: "Kevin Kline",
    leadAnalystName: "Liz Lemon",
  },
};

export const APPROVED_ITEM_EXPORT = {
  "Formal RAI Response": "-- --",
  "Initial Submission": "01/01/2024",
  "Latest Package Activity": "02/01/2024",
  State: APPROVED_ITEM._source.state,
  "Submitted By": APPROVED_ITEM._source.submitterName,
  "CPOC Name": APPROVED_ITEM._source.leadAnalystName,
  "Final Disposition": "05/01/2024",
  "Formal RAI Requested": "-- --",
  "Submission Source": "OneMAC",
};

export const BLANK_ITEM = {
  _id: "MD-07-2024",
  _source: {
    id: "MD-07-2024",
    seatoolStatus: SEATOOL_STATUS.PENDING,
    cmsStatus: statusToDisplayToCmsUser[SEATOOL_STATUS.PENDING],
    stateStatus: statusToDisplayToStateUser[SEATOOL_STATUS.PENDING],
    origin: "OneMAC",
  },
};

export const BLANK_ITEM_EXPORT = {
  Authority: "-- --",
  "Formal RAI Response": "-- --",
  "Initial Submission": "-- --",
  "Latest Package Activity": "-- --",
  State: "-- --",
  "Submitted By": "-- --",
  "CPOC Name": "-- --",
  "Final Disposition": "-- --",
  "Formal RAI Requested": "-- --",
  "Submission Source": "OneMAC",
};
