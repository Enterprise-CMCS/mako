import { beforeAll, afterEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { uploadFiles } from "@/utils/test-helpers/uploadFiles";
import { formSchemas } from "@/formSchemas";
import { TemporaryExtensionForm } from ".";
import { renderForm, renderFormWithPackageSection } from "@/utils/test-helpers/renderForm";
import { mockApiRefinements, skipCleanup } from "@/utils/test-helpers/skipCleanup";
import * as api from "@/api";
import {
  EXISTING_ITEM_PENDING_ID,
  EXISTING_ITEM_APPROVED_NEW_ID,
  NOT_FOUND_ITEM_ID,
  VALID_ITEM_TEMPORARY_EXTENSION_ID,
  TEST_ITEM_ID,
} from "mocks";

const upload = uploadFiles<(typeof formSchemas)["temporary-extension"]>();

describe("Temporary Extension", () => {
  beforeAll(() => {
    mockApiRefinements();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("EXISTING WAIVER ID", async () => {
    const spyAuth = vi.spyOn(api, "useGetUser");
    const spy = vi.spyOn(api, "useGetItem");

    // set the Item Id to TEST_ITEM_ID
    renderFormWithPackageSection(<TemporaryExtensionForm />, TEST_ITEM_ID, "Medicaid SPA");
    await vi.waitUntil(async () =>
      // expect(spyAuth).toHaveLastReturnedWith(expect.objectContaining({ status: "success" })),
      expect(spyAuth).toHaveReturnedTimes(2),
    );

    await vi.waitFor(async () =>
      expect(spy).toHaveLastReturnedWith(
        expect.objectContaining({
          status: "success",
        }),
      ),
    );

    const waiverNumberLabel = screen.getByText("Medicaid SPA");
    const existentIdLabel = screen.getByText(/Temporary Extension Type/);

    expect(waiverNumberLabel).toBeInTheDocument();
    expect(existentIdLabel).toBeInTheDocument();
  });

  test.skip("TEMPORARY EXTENSION TYPE", async () => {
    // mock `useGetItem` to signal there's temp-ext submission to render
    // @ts-ignore - expects the _whole_ React-Query object (annoying to type out)
    // vi.spyOn(api, "useGetItem").mockImplementation(() => ({ data: undefined }));
    // render temp-ext form with no route params
    renderForm(<TemporaryExtensionForm />);
    // enable render cleanup here
    skipCleanup();

    const teTypeDropdown = screen.getByRole("combobox");

    await userEvent.click(teTypeDropdown);

    const teOptionToClick = screen.getByRole("option", {
      name: "1915(b)",
    });

    await userEvent.click(teOptionToClick);

    expect(teTypeDropdown).toHaveTextContent("1915(b)");
  });

  test.skip("APPROVED INITIAL OR RENEWAL WAIVER NUMBER", async () => {
    const waiverNumberInput = screen.getByLabelText(/Approved Initial or Renewal Waiver Number/);
    const waiverNumberLabel = screen.getByTestId("waiverNumber-label");

    // test record does not exist error occurs
    await userEvent.type(waiverNumberInput, NOT_FOUND_ITEM_ID);
    const recordDoesNotExistError = screen.getByText(
      "According to our records, this Approved Initial or Renewal Waiver Number does not yet exist. Please check the Approved Initial or Renewal Waiver Number and try entering it again.",
    );
    expect(recordDoesNotExistError).toBeInTheDocument();
    await userEvent.clear(waiverNumberInput);

    // test record is not approved error occurs
    await userEvent.type(waiverNumberInput, EXISTING_ITEM_PENDING_ID);
    const recordIsNotApproved = screen.getByText(
      "According to our records, this Approved Initial or Renewal Waiver Number is not approved. You must supply an approved Initial or Renewal Waiver Number.",
    );
    expect(recordIsNotApproved).toBeInTheDocument();
    await userEvent.clear(waiverNumberInput);

    await userEvent.type(waiverNumberInput, EXISTING_ITEM_APPROVED_NEW_ID);

    expect(waiverNumberLabel).not.toHaveClass("text-destructive");
  });

  test.skip("TEMPORARY EXTENSION REQUEST NUMBER", async () => {
    const requestNumberInput = screen.getByLabelText(/Temporary Extension Request Number/);
    const requestNumberLabel = screen.getByTestId("requestNumber-label");

    // invalid TE request format
    await userEvent.type(requestNumberInput, EXISTING_ITEM_APPROVED_NEW_ID);
    const invalidRequestNumberError = screen.getByText(
      "The Temporary Extension Request Number must be in the format of SS-####.R##.TE## or SS-#####.R##.TE##",
    );
    expect(invalidRequestNumberError).toBeInTheDocument();
    await userEvent.clear(requestNumberInput);

    await userEvent.type(requestNumberInput, VALID_ITEM_TEMPORARY_EXTENSION_ID);

    expect(requestNumberLabel).not.toHaveClass("text-destructive");
  });

  test.skip("WAIVER EXTENSION REQUEST", async () => {
    const cmsForm179PlanLabel = await upload("waiverExtensionRequest");
    expect(cmsForm179PlanLabel).not.toHaveClass("text-destructive");
  });

  test.skip("submit button is enabled", async () => {
    expect(screen.getByTestId("submit-action-form")).toBeEnabled();
  });
});
