import { Page, BrowserContext, Browser, expect } from "@playwright/test";

import { DFlexPageTest as test } from "dflex-e2e-utils";

test.describe("Stress testing generated keys with client side rendering", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;
  // let DOMGenKeys: DOMGenKeysType;

  test.beforeAll(async ({ browser, baseURL }) => {
    activeBrowser = browser;
    context = await activeBrowser.newContext();
    page = await context.newPage();
    await page.goto(baseURL!);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  async function clickAndNavigate(
    elementType: "symmetric" | "asymmetric" | "transformation",
  ) {
    switch (elementType) {
      case "symmetric":
        await page.click('a[href="/list/symmetric"]');
        await page.waitForSelector("ul#symmetric-container-list");
        break;

      case "asymmetric":
        await page.click('a[href="/list/asymmetric"]');
        await page.waitForSelector("ul#asymmetric-container-list");
        break;

      case "transformation":
        await page.click('a[href="/list/transformation"]');
        await page.waitForSelector("ul#trans-container-list");
        break;

      default:
        throw new Error(`Invalid element type: ${elementType}`);
    }

    // Go back to the main page
    await page.goBack();

    // Wait for the main page content to be visible
    await page.waitForSelector("div#main-page-content");
  }

  const clickAndNavigateSymmetric = () => clickAndNavigate("symmetric");
  const clickAndNavigateAsymmetric = () => clickAndNavigate("asymmetric");
  const clickAndNavigateTransformation = () =>
    clickAndNavigate("transformation");

  async function runTest(i: number, fn: () => Promise<void>) {
    if (i > 0) {
      await fn();

      // Call the function recursively with the updated index
      await runTest(i - 1, fn);
    }
  }
  test("Navigation and interaction to generate keys (Symmetric)", async () => {
    runTest(15, clickAndNavigateSymmetric);
  });

  test("Navigation and interaction to generate keys (Asymmetric)", async () => {
    runTest(15, clickAndNavigateAsymmetric);
  });

  test("Navigation and interaction to generate keys (Transformation)", async () => {
    runTest(15, clickAndNavigateTransformation);
  });

  test("Navigation and interaction to generate keys2", async () => {
    expect(true).toBe(true);
  });
});
