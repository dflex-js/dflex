import {
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  //   assertChildrenOrderIDs,
  //   assertConsoleMsg,
  //   assertDefaultChildrenIndex,
  // DraggedRect,
  getDraggedRect,
  initialize,
  // invokeKeyboardAndAssertEmittedMsg,
  moveDragged,
} from "dflex-e2e-utils";

test.describe("DOM Mirror element is above both containers", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  // Second container.
  //   let elmAParent: Locator;
  let elmBParent: Locator;
  let elmA1: Locator;

  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "No need to test it for multiple browsers.",
  );

  test.skip(process.platform === "darwin", "Skip the test on Mac devices.");

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/windowed-dual-list");

    [, elmA1, elmBParent] = await Promise.all([
      page.locator("#dflex_id_0"),
      page.locator("#list-a-1"),
      page.locator("#dflex_id_1"),
    ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Move elm1 outside its container to the (b) container", async () => {
    await getDraggedRect(elmA1);
    await moveDragged(-1, 230);
    await moveDragged(450, -1);
  });

  test("dragged is above parent (b) container", async () => {
    await expect(elmBParent).toHaveScreenshot("parent-b.png");
  });
});
