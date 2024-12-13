import { test } from "@playwright/test";
import { HomePage, LoginPage } from "pages";

test.describe("Form Submission", async () => {

  test("Create and submit a Medicaid SPA", async ({ page }) => {

    /* Login */
    // Navigate to the OneMAC Home Page using the home.page.ts file. 
    // Login to MAKO as a State User, using the loginPage.ts script to navigate to the Login prompt. 
    // Refer to the users.ts file to view the available users for MAKO.

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage;
    await loginPage.login("", "");

    /* Dashboard */
    // Select New Submission on the Dashboard page. 
    // Select State Plan Amendment (SPA) on the Submission Type page. 
    // Select Medicaid SPA on the SPA Type page. 
    // Select All Other Medicaid SPA Submissions for Medicaid SPA Type. 
    // This should take the user to the Medicaid SPA Details page. 
    // Navigate to the Dashboard and click on "New Submission" Button. Convert to Page object in the future. 
    await page.goto("https://mako-dev.cms.gov");
    await page.getByText("New Submission").click();
    await page.getByRole('heading', { name: "State Plan Amendment (SPA)" }).click();
    await page.getByRole('heading', { name: "Medicaid SPA" }).click();
    await page.getByRole('heading', { name: "All Other Medicaid SPA Submissions" }).click();

    /* Medicaid SPA Details */
    // Enter the SPA ID in the following formats: SS-YY-NNNN, SS-YY-NNNN-XXXX where SS is the state and YY is the current year.
    // Enter the Proposed Effective Date of Medicaid SPA. Default date is the date of SPA creation. 
    await page.getByRole("textbox", { name: "SPA ID" }).fill("MD-24-NNNN");
    await page.getByRole("button", { name: "Proposed Effective Date of Medicaid SPA" }).click();

    /* Attachments */
    // Generate a sample CMS Form 179 file and attach it to the CMS Form 179 field. 
    // Generate a sample SPA Pages file and attach it to the SPA Pages field.
    await page.locator('//*[@id="root"]/div/main/div[2]/form/section[2]/div/section/div[1]/div/p/span').click();
    await page.locator('//*[@id="root"]/div/main/div[2]/form/section[2]/div/section/div[2]/div/p/span').click();

    /* Submission */
    // Click Submit. The user should then be returned to the Dashboard page. 
    // Verify the submission of the SPA by searching for the newly created SPA using the Dashboard.
    // Confirm that a search of the newly-created SPA opens a Package Details page of the Medicaid SPA. 
    await page.locator('//*[@id="root"]/div/main/div[2]/form/section[4]/button[1]').click();

  });
});
