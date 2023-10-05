import {
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  getDraggedRect,
  initialize,
  moveDragged,
} from "dflex-e2e-utils";

test.describe("Stabilizer with scroll", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elm1: Locator;
  let elm2: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/scrollable-page");

    [elm1, elm2] = await Promise.all([
      page.locator("#id_0"),
      page.locator("#id_1"),
    ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Scroll the page in Y axis", async () => {
    await page.evaluate(() => {
      window.scrollBy(0, 20);
    });
  });

  test("Move elm1 into elm2 position", async () => {
    await getDraggedRect(elm1);
    await moveDragged(-1, 50);
  });

  test("elm2 transformed into elm1 position", async ({ browserName }) => {
    if (browserName === "firefox") {
      await expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -88.2)");
    } else {
      await expect(elm2).toHaveCSS(
        "transform",
        "matrix(1, 0, 0, 1, 0, -88.1875)",
      );
    }
  });

  test("Move elm1 back into its position", async () => {
    await moveDragged(-1, 0);
  });

  test("stabilizer doesn't prevent elm2 from returning into its position", async () => {
    await expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  });
});
