import {
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  assertChildrenOrderIDs,
  assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  invokeKeyboardAndAssertEmittedMsg,
  moveDragged,
} from "dflex-e2e-utils";

test.describe("Testing horizontal transformation in depth (1). Vertical in depth (1)", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elmGrandParent: Locator;

  let elmP1: Locator;
  let elmP2: Locator;
  let elmP3: Locator;

  let elm10: Locator;
  let elm09: Locator;
  let elm11: Locator;
  let elm12: Locator;

  test.beforeAll(async ({ browser, browserName, baseURL }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName);
    await page.goto(baseURL!);

    [elm09, elm10, elm11, elm12, elmGrandParent, elmP1, elmP2, elmP3] =
      await Promise.all([
        page.locator("#id-9"),
        page.locator("#id-10"),
        page.locator("#id-11"),
        page.locator("#id-12"),

        page.locator("#dflex_id_0"),
        page.locator("#id-p1"),
        page.locator("#id-p2"),
        page.locator("#id-p3"),
      ]);
  });

  async function transformOneStepToLeft() {
    await getDraggedRect(elmP3);
    await moveDragged(-230, -1);
    await page.dispatchEvent("#id-p3", "mouseup", {
      button: 0,
      force: true,
    });
  }

  async function assertDepth0Transformation() {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm11).toHaveCSS("transform", "none"),
      expect(elm12).toHaveCSS("transform", "none"),
    ]);
  }

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Transform elm#09 replacing elm#10 in depth-0", async () => {
    const draggedRect = await getDraggedRect(elm09);
    await moveDragged(-1, draggedRect.height);
    await page.mouse.up();
  });

  test("Siblings in depth-0 have been transformed", async () => {
    await assertDepth0Transformation();
  });

  test("Siblings index initiated correctly at depth: 1", async () => {
    await assertDefaultChildrenIndex(elmGrandParent);
  });

  test("Transform element (#id-p3) one step to the left", async () => {
    await transformOneStepToLeft();
  });

  test("Siblings have correct positions in dp-0 and dp-1", async () => {
    await Promise.all([
      expect(elmP1).toHaveCSS("transform", "none"),
      expect(elmP2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 214, 0)"),
      expect(elmP3).toHaveCSS("transform", "matrix(1, 0, 0, 1, -214, 0)"),
      assertDepth0Transformation(),
    ]);
  });

  test("Transform element (#id-p3) another step to the left", async () => {
    await transformOneStepToLeft();
  });

  test("All Siblings have been transformed correctly in dp-0 and dp-1", async () => {
    await Promise.all([
      expect(elmP1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 214, 0)"),
      expect(elmP2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 214, 0)"),
      expect(elmP3).toHaveCSS("transform", "matrix(1, 0, 0, 1, -428, 0)"),
      assertDepth0Transformation(),
    ]);
  });

  test("Trigger key `c` to commit the transformed elements and read the emitted message for mutation", async () => {
    await invokeKeyboardAndAssertEmittedMsg([
      "id-10",
      "id-9",
      "id-11",
      "id-12",
    ]);
  });

  test("Siblings have reconciled and don't have transformation", async () => {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "none"),
      expect(elm10).toHaveCSS("transform", "none"),
      expect(elm11).toHaveCSS("transform", "none"),
      expect(elm12).toHaveCSS("transform", "none"),

      expect(elmP1).toHaveCSS("transform", "none"),
      expect(elmP2).toHaveCSS("transform", "none"),
      expect(elmP3).toHaveCSS("transform", "none"),
    ]);
  });

  test("Siblings have the correct order in depth-1", async () => {
    const FINAL_IDS = ["id-p3", "id-p1", "id-p2"];

    await Promise.all([
      assertChildrenOrderIDs(elmGrandParent, FINAL_IDS),
      assertDefaultChildrenIndex(elmGrandParent),
    ]);
  });

  test("Siblings have the correct order in depth-0", async () => {
    const FINAL_IDS = ["id-10", "id-9", "id-11", "id-12"];

    await Promise.all([
      assertChildrenOrderIDs(elmP3, FINAL_IDS),
      assertDefaultChildrenIndex(elmP3),
    ]);
  });
});
