import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
// import AppK from "./AppK";
// import CHIP_SPA from "./CHIP_SPA";
// import Medicaid_SPA from "./Medicaid_SPA";
// import Waiver_Capitated from "./Waiver_Capitated"; // TODO: fix these imports

describe.skip("Respond To RAI CMS Email Snapshot Test", () => {
  it("renders a AppKCMSEmailPreview Preview Template", () => {
    const template = render(<AppK />);

    expect(template).toMatchSnapshot();
  });
  it("renders a ChipSPA Preview Template", () => {
    const template = render(<CHIP_SPA />);

    expect(template).toMatchSnapshot();
  });
  it("renders a Medicaid_SPA Preview Template", () => {
    const template = render(<Medicaid_SPA />);

    expect(template).toMatchSnapshot();
  });
  it("renders a Waiver Capitated Preview Template", () => {
    const template = render(<Waiver_Capitated />);

    expect(template).toMatchSnapshot();
  });
});