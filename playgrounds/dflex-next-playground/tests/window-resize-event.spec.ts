/* eslint-disable no-underscore-dangle */
import { Page, BrowserContext, Browser, expect } from "@playwright/test";

import { DFlexPageTest as test } from "dflex-e2e-utils";

test.describe("Resize window when store in not active", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

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

  test("Initiate store by navigation to registered elements", async () => {
    await page.click('a[href="/list/symmetric"]');
    await page.waitForSelector("ul#symmetric-container-list");
    await page.goBack();

    // Wait for clean up to be done internally.
    await page.waitForTimeout(500);

    await page.waitForSelector("div#main-page-content");
  });

  test("should not log errors on resize", async () => {
    // Add an event listener to capture console logs
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        expect(true).toBeFalsy(); // This will fail the test if an error is logged
      }
    });

    // Simulate a window resize
    await page.setViewportSize({ width: 800, height: 600 });
  });
});
