import {
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  getDraggedRect,
  initialize,
  moveDragged,
  invokeKeyboardAndAssertEmittedMsg,
} from "dflex-e2e-utils";

test.describe("Testing (enableDragSettleOnSwitch) global flag", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elm1: Locator;
  let elm2: Locator;
  let elm3: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/gap");

    [elm1, elm2, elm3] = await Promise.all([
      page.locator("#mtg"),
      page.locator("#org"),
      page.locator("#gym"),
    ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Move first element outside its threshold then release", async () => {
    await getDraggedRect(elm1);
    await moveDragged(-1, 44);
    await page.dispatchEvent("#mtg", "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("siblings are transformed", async () => {
    if (process.platform === "win32") {
      await Promise.all([
        expect(elm1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 139)"),
        expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -139)"),
        expect(elm3).toHaveCSS("transform", "none"),
      ]);
    } else {
      await Promise.all([
        expect(elm1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 136)"),
        expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -136)"),
        expect(elm3).toHaveCSS("transform", "none"),
      ]);
    }
  });

  test("Trigger key `c` to commit the transformed elements and read the emitted message for mutation", async () => {
    await invokeKeyboardAndAssertEmittedMsg(["org", "mtg", "gym"]);
  });

  test("siblings have none transformation", async () => {
    await Promise.all([
      expect(elm1).toHaveCSS("transform", "none"),
      expect(elm2).toHaveCSS("transform", "none"),
      expect(elm3).toHaveCSS("transform", "none"),
    ]);
  });
});
