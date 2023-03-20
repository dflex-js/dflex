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

test.describe("Transformation inside grid container", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elmParent: Locator;
  let elm1: Locator;
  let elm2: Locator;
  let elm3: Locator;
  let elm4: Locator;
  let elm5: Locator;
  let elm6: Locator;
  let elm7: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/grid");

    [elmParent, elm1, elm2, elm3, elm4, elm5, elm6, elm7] = await Promise.all([
      page.locator("#id-p2"),
      page.locator("#id-2"),
      page.locator("#id-3"),
      page.locator("#id-4"),
      page.locator("#id-5"),
      page.locator("#id-6"),
      page.locator("#id-7"),
      page.locator("#id-8"),
    ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test.describe("Moving elements horizontally", () => {
    const FINAL_IDS_ROUND_1 = [
      "id-4",
      "id-2",
      "id-3",
      "id-7",
      "id-5",
      "id-6",
      "id-8",
    ];

    test("Move elm3 into elm1 position in the first row", async () => {
      await getDraggedRect(elm3);
      await moveDragged(-470, -1);
    });

    test("Only siblings inside the row are transformed", async () => {
      await Promise.all([
        expect(elm1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)"),
        expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)"),
        expect(elm4).toHaveCSS("transform", "none"),
        expect(elm5).toHaveCSS("transform", "none"),
        expect(elm6).toHaveCSS("transform", "none"),
        expect(elm7).toHaveCSS("transform", "none"),
      ]);
    });

    test("Triggering mouse up keeps siblings inside their positions", async () => {
      await page.dispatchEvent("#id-4", "mouseup", {
        button: 0,
        force: true,
      });

      await Promise.all([
        expect(elm1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)"),
        expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)"),
        expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, -510, 0)"), // Dragged
        expect(elm4).toHaveCSS("transform", "none"),
        expect(elm5).toHaveCSS("transform", "none"),
        expect(elm6).toHaveCSS("transform", "none"),
        expect(elm7).toHaveCSS("transform", "none"),
      ]);
    });

    test("Move elm7 into elm1 position in the second row", async () => {
      await getDraggedRect(elm6);
      await moveDragged(-470, -1);
    });

    test("Triggering mouse up keeps siblings inside their positions for first and second row", async () => {
      await page.dispatchEvent("#id-7", "mouseup", {
        button: 0,
        force: true,
      });

      await Promise.all([
        expect(elm1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)"),
        expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)"),
        expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, -510, 0)"), // Dragged-2
        expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)"),
        expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)"),
        expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, -510, 0)"), // Dragged-2
        expect(elm7).toHaveCSS("transform", "none"),
      ]);
    });

    test("Trigger key `c` to commit the transformed elements and read the emitted message for mutation", async () => {
      await invokeKeyboardAndAssertEmittedMsg(FINAL_IDS_ROUND_1);
    });

    test("Siblings have reconciled and don't have transformation", async () => {
      await Promise.all([
        expect(elm1).toHaveCSS("transform", "none"),
        expect(elm2).toHaveCSS("transform", "none"),
        expect(elm3).toHaveCSS("transform", "none"),
        expect(elm4).toHaveCSS("transform", "none"),
        expect(elm5).toHaveCSS("transform", "none"),
        expect(elm6).toHaveCSS("transform", "none"),
        expect(elm7).toHaveCSS("transform", "none"),
      ]);
    });

    test("Siblings have the correct DOM order in depth-1", async () => {
      await Promise.all([
        assertChildrenOrderIDs(elmParent, FINAL_IDS_ROUND_1),
        assertDefaultChildrenIndex(elmParent),
      ]);
    });
  });
});
