import { Page, BrowserContext, Browser } from "@playwright/test";

import { DFlexPageTest as test } from "dflex-e2e-utils";

test.describe("Testing generated keys with client side rendering", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  test.beforeAll(async ({ browser }) => {
    activeBrowser = browser;
    context = await activeBrowser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Visit main page, navigate to DnD component page", async () => {
    // Visit the DnD component page
    await page.click('a[href="/list/asymmetric"]');
    await page.waitForSelector("ul#dflex_id_0");

    // Go back to the main page
    await page.goBack();

    // Wait for the main page content to be visible
    await page.waitForSelector("div#main-page-content");
  });
});
