import { describe, expect, it, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { screen, within, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportToCsv } from "export-to-csv";
import { opensearch } from "shared-types";
import { LABELS } from "@/utils";
import {
  renderDashboard,
  getDashboardQueryString,
  verifyFiltering,
  verifyChips,
  verifyPagination,
  skipCleanup,
  PENDING_SUBMITTED_ITEM,
  PENDING_SUBMITTED_ITEM_EXPORT,
  PENDING_RAI_REQUEST_ITEM,
  PENDING_RAI_REQUEST_ITEM_EXPORT,
  PENDING_RAI_RECEIVED_ITEM,
  PENDING_RAI_RECEIVED_ITEM_EXPORT,
  RAI_WITHDRAW_ENABLED_ITEM,
  RAI_WITHDRAW_ENABLED_ITEM_EXPORT,
  RAI_WITHDRAW_DISABLED_ITEM,
  RAI_WITHDRAW_DISABLED_ITEM_EXPORT,
  APPROVED_ITEM,
  APPROVED_ITEM_EXPORT,
  BLANK_ITEM,
  BLANK_ITEM_EXPORT,
  Storage,
} from "@/utils/test-helpers";
import {
  TEST_STATE_SUBMITTER_USER,
  TEST_CMS_REVIEWER_USER,
  TEST_HELP_DESK_USER,
  TEST_READ_ONLY_USER,
  setMockUsername,
} from "mocks";
import { BLANK_VALUE } from "@/consts";
import * as api from "@/api";
import { WaiversList } from "./index";

const pendingDoc = {
  ...PENDING_SUBMITTED_ITEM._source,
  authority: "1915(b)",
  actionType: "New",
} as opensearch.main.Document;
const raiRequestDoc = {
  ...PENDING_RAI_REQUEST_ITEM._source,
  authority: "1915(c)",
  actionType: "New",
} as opensearch.main.Document;
const raiReceivedDoc = {
  ...PENDING_RAI_RECEIVED_ITEM._source,
  authority: "1915(b)",
  actionType: "New",
} as opensearch.main.Document;
const withdrawEnabledDoc = {
  ...RAI_WITHDRAW_ENABLED_ITEM._source,
  authority: "Chip SPA",
  actionType: "New",
} as opensearch.main.Document;
const withdrawDisabledDoc = {
  ...RAI_WITHDRAW_DISABLED_ITEM._source,
  authority: "1915(b)",
  actionType: "New",
} as opensearch.main.Document;
const approvedDoc = {
  ...APPROVED_ITEM._source,
  authority: "1915(c)",
  actionType: "New",
} as opensearch.main.Document;
const blankDoc = {
  ...BLANK_ITEM._source,
} as opensearch.main.Document;

const items = [
  {
    _id: pendingDoc.id,
    _source: pendingDoc,
  },
  {
    _id: raiRequestDoc.id,
    _source: raiRequestDoc,
  },
  {
    _id: raiReceivedDoc.id,
    _source: raiReceivedDoc,
  },
  {
    _id: withdrawEnabledDoc.id,
    _source: withdrawEnabledDoc,
  },
  {
    _id: withdrawDisabledDoc.id,
    _source: withdrawDisabledDoc,
  },
  {
    _id: approvedDoc.id,
    _source: approvedDoc,
  },
  {
    _id: blankDoc.id,
    _source: blankDoc,
  },
] as opensearch.Hit<opensearch.main.Document>[];
const hitCount = items.length;
const defaultHits: opensearch.Hits<opensearch.main.Document> = {
  hits: items,
  max_score: 5,
  total: { value: hitCount, relation: "eq" },
};

const getExpectedExportData = (useCmsStatus: boolean) => {
  return [
    {
      ...PENDING_SUBMITTED_ITEM_EXPORT,
      Authority: pendingDoc.authority,
      "Waiver Number": pendingDoc.id,
      Status: useCmsStatus ? pendingDoc.cmsStatus : pendingDoc.stateStatus,
      "Action Type": LABELS[pendingDoc.actionType] || pendingDoc.actionType,
    },
    {
      ...PENDING_RAI_REQUEST_ITEM_EXPORT,
      Authority: raiRequestDoc.authority,
      "Waiver Number": raiRequestDoc.id,
      Status: useCmsStatus ? raiRequestDoc.cmsStatus : raiRequestDoc.stateStatus,
      "Action Type": LABELS[raiRequestDoc.actionType] || raiRequestDoc.actionType,
    },
    {
      ...PENDING_RAI_RECEIVED_ITEM_EXPORT,
      Authority: raiReceivedDoc.authority,
      "Waiver Number": raiReceivedDoc.id,
      Status: useCmsStatus ? raiReceivedDoc.cmsStatus : raiReceivedDoc.stateStatus,
      "Action Type": LABELS[raiReceivedDoc.actionType] || raiReceivedDoc.actionType,
    },
    {
      ...RAI_WITHDRAW_ENABLED_ITEM_EXPORT,
      Authority: withdrawEnabledDoc.authority,
      "Waiver Number": withdrawEnabledDoc.id,
      Status: `${useCmsStatus ? withdrawEnabledDoc.cmsStatus : withdrawEnabledDoc.stateStatus} (Withdraw Formal RAI Response - Enabled)`,
      "Action Type": LABELS[withdrawEnabledDoc.actionType] || withdrawEnabledDoc.actionType,
    },
    {
      ...RAI_WITHDRAW_DISABLED_ITEM_EXPORT,
      Authority: withdrawDisabledDoc.authority,
      "Waiver Number": withdrawDisabledDoc.id,
      Status: useCmsStatus ? withdrawDisabledDoc.cmsStatus : withdrawDisabledDoc.stateStatus,
      "Action Type": LABELS[withdrawDisabledDoc.actionType] || withdrawDisabledDoc.actionType,
    },
    {
      ...APPROVED_ITEM_EXPORT,
      Authority: approvedDoc.authority,
      "Waiver Number": approvedDoc.id,
      Status: useCmsStatus ? approvedDoc.cmsStatus : approvedDoc.stateStatus,
      "Action Type": LABELS[approvedDoc.actionType] || approvedDoc.actionType,
    },
    {
      ...BLANK_ITEM_EXPORT,
      Authority: "-- --",
      "Waiver Number": blankDoc.id,
      Status: useCmsStatus ? blankDoc.cmsStatus : blankDoc.stateStatus,
      "Action Type": "-- --",
    },
  ];
};

const verifyColumns = (hasActions: boolean) => {
  const table = screen.getByRole("table");

  if (hasActions) {
    expect(within(table).getByText("Actions", { selector: "th>div" })).toBeInTheDocument();
  }
  expect(within(table).getByText("Waiver Number", { selector: "th>div" })).toBeInTheDocument();
  expect(within(table).getByText("State", { selector: "th>div" })).toBeInTheDocument();
  expect(within(table).getByText("Authority", { selector: "th>div" })).toBeInTheDocument();
  expect(within(table).getByText("Action Type", { selector: "th>div" })).toBeInTheDocument();
  expect(within(table).getByText("Status", { selector: "th>div" })).toBeInTheDocument();
  expect(within(table).getByText("Initial Submission", { selector: "th>div" })).toBeInTheDocument();
  expect(
    within(table).getByText("Latest Package Activity", { selector: "th>div" }),
  ).toBeInTheDocument();
  expect(
    within(table).getByText("Formal RAI Response", { selector: "th>div" }),
  ).toBeInTheDocument();
  expect(within(table).getByText("Submitted By", { selector: "th>div" })).toBeInTheDocument();
  expect(table.firstElementChild.firstElementChild.childElementCount).toEqual(hasActions ? 10 : 9);

  // Check that the correct amount rows appear
  expect(screen.getAllByRole("row").length).toEqual(hitCount + 1); // add 1 for header
};

const verifyRow = (
  doc: opensearch.main.Document,
  {
    hasActions,
    status,
    submissionDate = BLANK_VALUE,
    makoChangedDate = BLANK_VALUE,
    finalDispositionDate = BLANK_VALUE,
    raiRequestedDate = BLANK_VALUE,
    raiReceivedDate = BLANK_VALUE,
  }: {
    hasActions: boolean;
    status: string;
    submissionDate?: string;
    makoChangedDate?: string;
    raiRequestedDate?: string;
    finalDispositionDate?: string;
    raiReceivedDate?: string;
  },
) => {
  const row = within(screen.getByRole("table")).getByText(doc.id).parentElement.parentElement;
  const cells = row.children;
  let cellIndex = hasActions ? 1 : 0;

  if (hasActions) {
    // Actions
    expect(within(row).getByRole("button", { name: "Available actions" }));
  }
  expect(cells[cellIndex].textContent).toEqual(doc.id); // SPA ID
  expect(cells[cellIndex].firstElementChild.getAttribute("href")).toEqual(
    `/details/${encodeURI(doc.authority)}/${doc.id}`,
  );
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(doc.state || BLANK_VALUE); // State
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(doc.authority || BLANK_VALUE); // Authority
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(
    LABELS[doc.actionType] || doc.actionType || BLANK_VALUE,
  ); // Authority
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(status); // Status
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(submissionDate); // Initial Submitted
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(finalDispositionDate); // Final Disposition
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(doc.origin); // Submission Source
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(makoChangedDate); // Latest Package Activity
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(raiRequestedDate); // Formal RAI Requested
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(raiReceivedDate); // Formal RAI Response
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(doc.leadAnalystName || BLANK_VALUE); // CPOC Name
  cellIndex++;
  expect(cells[cellIndex].textContent).toEqual(doc.submitterName || BLANK_VALUE); // Submitted By
};

describe("WaiversList", () => {
  const setup = async (hits: opensearch.Hits<opensearch.main.Document>, queryString: string) => {
    globalThis.localStorage = new Storage();
    const user = userEvent.setup();
    const rendered = renderDashboard(
      <WaiversList />,
      {
        data: hits,
        isLoading: false,
        error: null,
      },
      queryString,
    );
    if (screen.queryAllByLabelText("three-dots-loading")?.length > 0) {
      await waitForElementToBeRemoved(() => screen.queryAllByLabelText("three-dots-loading"));
    }
    return {
      user,
      ...rendered,
    };
  };

  // most of the tests are using MSW to get a set of generic items,
  // however these tests are using items created in this file that cover
  // specific cases, so we want to get those from the `getMainExportData`
  // call instead of whatever MSW is returning
  vi.spyOn(api, "getMainExportData").mockResolvedValue(items.map((item) => ({ ...item._source })));

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return no columns if the user is not logged in", async () => {
    setMockUsername(null);

    await setup(
      defaultHits,
      getDashboardQueryString({
        tab: "spas",
      }),
    );

    const table = screen.getByRole("table");
    expect(table.firstElementChild.firstElementChild.childElementCount).toEqual(0);
  });

  describe.each([
    ["State Submitter", TEST_STATE_SUBMITTER_USER.username, true, false],
    ["CMS Reviewer", TEST_CMS_REVIEWER_USER.username, true, true],
    ["CMS Help Desk User", TEST_HELP_DESK_USER.username, false, false],
    ["CMS Read-Only User", TEST_READ_ONLY_USER.username, false, true],
  ])("as a %s", (title, username, hasActions, useCmsStatus) => {
    let user;
    beforeAll(async () => {
      skipCleanup();

      setMockUsername(username);

      ({ user } = await setup(
        defaultHits,
        getDashboardQueryString({
          tab: "spas",
        }),
      ));
    });

    beforeEach(() => {
      setMockUsername(username);
    });

    afterAll(() => {
      cleanup();
    });

    it("should display the dashboard as expected", async () => {
      verifyFiltering(4); // 4 hidden columns by default
      verifyChips([]); // no filters by default
      verifyColumns(hasActions);
      verifyPagination(hitCount);
    });

    it("should handle showing all of the columns", async () => {
      // show all the hidden columns
      await user.click(screen.queryByRole("button", { name: "Columns (4 hidden)" }));
      const columns = screen.queryByRole("dialog");
      await user.click(within(columns).getByText("Final Disposition"));
      await user.click(within(columns).getByText("Submission Source"));
      await user.click(within(columns).getByText("Formal RAI Requested"));
      await user.click(within(columns).getByText("CPOC Name"));

      const table = screen.getByRole("table");
      expect(
        within(table).getByText("Final Disposition", { selector: "th>div" }),
      ).toBeInTheDocument();
      expect(
        within(table).getByText("Submission Source", { selector: "th>div" }),
      ).toBeInTheDocument();
      expect(
        within(table).getByText("Formal RAI Requested", { selector: "th>div" }),
      ).toBeInTheDocument();
      expect(within(table).getByText("CPOC Name", { selector: "th>div" })).toBeInTheDocument();
    });

    it.each([
      [
        "a new item that is pending without RAI",
        pendingDoc,
        {
          hasActions,
          status: useCmsStatus ? pendingDoc.cmsStatus : pendingDoc.stateStatus,
          submissionDate: "01/01/2024",
          makoChangedDate: "02/01/2024",
        },
      ],
      [
        "an item that has requested an RAI",
        raiRequestDoc,
        {
          hasActions,
          status: useCmsStatus ? raiRequestDoc.cmsStatus : raiRequestDoc.stateStatus,
          submissionDate: "01/01/2024",
          makoChangedDate: "02/01/2024",
          raiRequestedDate: "03/01/2024",
        },
      ],
      [
        "an item that has received an RAI",
        raiReceivedDoc,
        {
          hasActions,
          status: useCmsStatus ? raiReceivedDoc.cmsStatus : raiReceivedDoc.stateStatus,
          submissionDate: "01/01/2024",
          makoChangedDate: "02/01/2024",
          raiRequestedDate: "03/01/2024",
          raiReceivedDate: "04/01/2024",
        },
      ],
      [
        "an item that has RAI Withdraw enabled",
        withdrawEnabledDoc,
        {
          hasActions,
          status: `${useCmsStatus ? withdrawEnabledDoc.cmsStatus : withdrawEnabledDoc.stateStatus}· Withdraw Formal RAI Response - Enabled`,
          submissionDate: "01/01/2024",
          makoChangedDate: "02/01/2024",
          raiRequestedDate: "03/01/2024",
          raiReceivedDate: "04/01/2024",
        },
      ],
      [
        "an item with RAI Withdraw disabled",
        withdrawDisabledDoc,
        {
          hasActions,
          status: useCmsStatus ? withdrawDisabledDoc.cmsStatus : withdrawDisabledDoc.stateStatus,
          submissionDate: "01/01/2024",
          makoChangedDate: "02/01/2024",
          raiRequestedDate: "03/01/2024",
          raiReceivedDate: "04/01/2024",
        },
      ],
      [
        "an item that is approved",
        approvedDoc,
        {
          hasActions,
          status: useCmsStatus ? approvedDoc.cmsStatus : approvedDoc.stateStatus,
          submissionDate: "01/01/2024",
          makoChangedDate: "02/01/2024",
          finalDispositionDate: "05/01/2024",
        },
      ],
      [
        "a blank item",
        blankDoc,
        {
          hasActions,
          status: useCmsStatus ? blankDoc.cmsStatus : blankDoc.stateStatus,
        },
      ],
    ])("should display the correct values for a row with %s", (title, doc, expected) => {
      verifyRow(doc, expected);
    });

    it("should handle export", async () => {
      const spy = vi.spyOn(ExportToCsv.prototype, "generateCsv").mockImplementation(() => {});

      await user.click(screen.queryByTestId("tooltip-trigger"));

      const expectedData = getExpectedExportData(useCmsStatus);
      expect(spy).toHaveBeenCalledWith(expectedData);
    });
  });
});
