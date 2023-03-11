import {
  test,
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  assertChildrenOrderIDs,
  assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  invokeKeyboardAndAssertEmittedMsg,
  moveDragged,
} from "../utils";

test.describe("Testing horizontal transformation in depth-1", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elmGrandParent: Locator;

  let elmP1: Locator;
  let elmP2: Locator;
  let elmP3: Locator;

  test.beforeAll(async ({ browser, browserName, baseURL }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName);
    await page.goto(baseURL!);

    [elmGrandParent, elmP1, elmP2, elmP3] = await Promise.all([
      page.locator("#dflex_id_0"),
      page.locator("#id-p1"),
      page.locator("#id-p2"),
      page.locator("#id-p3"),
    ]);
  });

  const FINAL_IDS = ["id-p3", "id-p1", "id-p2"];

  async function transformOneStepToLeft() {
    await getDraggedRect(elmP3);
    await moveDragged(-230, -1);
    await page.dispatchEvent("#id-p3", "mouseup", {
      button: 0,
      force: true,
    });
  }

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Siblings index initiated correctly at depth: 1", async () => {
    await assertDefaultChildrenIndex(elmGrandParent);
  });

  test("Transform element (#id-p3) one step to the left", async () => {
    await transformOneStepToLeft();
  });

  test("Siblings have correct positions", async () => {
    await Promise.all([
      expect(elmP1).toHaveCSS("transform", "none"),
      expect(elmP2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 214, 0)"),
      expect(elmP3).toHaveCSS("transform", "matrix(1, 0, 0, 1, -214, 0)"),
    ]);
  });

  test("Transform element (#id-p3) another step to the left", async () => {
    await transformOneStepToLeft();
  });

  test("All Siblings have been transformed correctly", async () => {
    await Promise.all([
      expect(elmP1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 214, 0)"),
      expect(elmP2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 214, 0)"),
      expect(elmP3).toHaveCSS("transform", "matrix(1, 0, 0, 1, -428, 0)"),
    ]);
  });

  test("Trigger key `c` to commit the transformed elements and read the emitted message for mutation", async () => {
    await invokeKeyboardAndAssertEmittedMsg(FINAL_IDS);
  });

  test("Siblings have reconciled and don't have transformation", async () => {
    await Promise.all([
      expect(elmP1).toHaveCSS("transform", "none"),
      expect(elmP2).toHaveCSS("transform", "none"),
      expect(elmP3).toHaveCSS("transform", "none"),
    ]);
  });

  test("Siblings have the correct order", async () => {
    await Promise.all([
      assertChildrenOrderIDs(elmGrandParent, FINAL_IDS),
      assertDefaultChildrenIndex(elmGrandParent),
    ]);
  });
});
