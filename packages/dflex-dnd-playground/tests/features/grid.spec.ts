import {
  test,
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  assertChildrenGrid,
  assertChildrenOrderIDs,
  assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  invokeKeyboardAndAssertEmittedMsg,
  moveDragged,
} from "../utils";

const { PACKAGE_BUNDLE } = process.env;

const isProdBundle = PACKAGE_BUNDLE === "production";

const SKIP_REASON = "This assertion works with development bundle only";

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

  const INITIAL_GRID = [
    { x: 0, y: 0 }, // first row
    { x: 1, y: 0 }, // first row
    { x: 2, y: 0 }, // first row

    { x: 0, y: 1 }, // second row
    { x: 1, y: 1 }, // second row
    { x: 2, y: 1 }, // second row

    { x: 0, y: 2 }, // third row.
  ];

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

    test("Check initial grid", async () => {
      test.skip(isProdBundle, SKIP_REASON);

      await assertChildrenGrid(elmParent, INITIAL_GRID);
    });

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

    test("elements grid is calculated correctly", async () => {
      test.skip(isProdBundle, SKIP_REASON);

      await assertChildrenGrid(elmParent, [
        { x: 1, y: 0 }, // first row - first change.
        { x: 2, y: 0 }, // first row - first change.
        { x: 0, y: 0 }, // first row - first change.

        { x: 0, y: 1 }, // second row
        { x: 1, y: 1 }, // second row
        { x: 2, y: 1 }, // second row

        { x: 0, y: 2 }, // third row.
      ]);
    });

    test("Move elm7 into elm4 position in the second row", async () => {
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

    test("elements grid is calculated correctly for first and second rows", async () => {
      test.skip(isProdBundle, SKIP_REASON);

      await assertChildrenGrid(elmParent, [
        { x: 1, y: 0 }, // first row - first change.
        { x: 2, y: 0 }, // first row - first change.
        { x: 0, y: 0 }, // first row - first change.

        { x: 1, y: 1 }, // second row - change this round
        { x: 2, y: 1 }, // second row
        { x: 0, y: 1 }, // second row

        { x: 0, y: 2 }, // third row.
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
        isProdBundle
          ? Promise.resolve()
          : assertChildrenGrid(elmParent, INITIAL_GRID),
      ]);
    });
  });

  test.describe("Moving elements vertically", () => {
    const FINAL_IDS_ROUND_2 = [
      "id-7",
      "id-5",
      "id-6",
      "id-8",
      "id-2",
      "id-3",
      "id-4",
    ];

    test("Check initial grid", async () => {
      test.skip(isProdBundle, SKIP_REASON);

      await assertChildrenGrid(elmParent, INITIAL_GRID);
    });

    test("Move elm3 into elm7 position in the first col", async () => {
      await getDraggedRect(elm3);
      await moveDragged(-1, 210);
      await page.dispatchEvent("#id-4", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("elements grid is calculated correctly", async () => {
      test.skip(isProdBundle, SKIP_REASON);

      await assertChildrenGrid(elmParent, [
        { x: 0, y: 2 }, // ------> first swap
        { x: 1, y: 0 }, // first row
        { x: 2, y: 0 }, // first row

        { x: 0, y: 0 }, // ------> first swap
        { x: 1, y: 1 }, // second row
        { x: 2, y: 1 }, // second row

        { x: 0, y: 1 }, // ------> first swap
      ]);
    });

    test("Only siblings inside the row are transformed", async () => {
      await Promise.all([
        expect(elm1).toHaveCSS("transform", "none"),
        expect(elm2).toHaveCSS("transform", "none"),
        expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 210)"), // Same col
        expect(elm4).toHaveCSS("transform", "none"),
        expect(elm5).toHaveCSS("transform", "none"),
        expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -105)"), // Same col
        expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -105)"), // Same col
      ]);
    });

    test("Move elm1 into elm4 position in the second col", async () => {
      await getDraggedRect(elm1);
      await moveDragged(-1, 140);
      await page.dispatchEvent("#id-2", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Only siblings in first and second rows transformed", async () => {
      await Promise.all([
        expect(elm1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 105)"), // Second col
        expect(elm2).toHaveCSS("transform", "none"),
        expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 210)"), // Same col
        expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -105)"), // Second col
        expect(elm5).toHaveCSS("transform", "none"),
        expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -105)"), // Same col
        expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -105)"), // Same col
      ]);
    });

    test("elements grid is calculated correctly for two cols", async () => {
      test.skip(isProdBundle, SKIP_REASON);

      await assertChildrenGrid(elmParent, [
        { x: 0, y: 2 }, // ------> first swap
        { x: 1, y: 1 }, // ------> second swap
        { x: 2, y: 0 }, // first row

        { x: 0, y: 0 }, // ------> first swap
        { x: 1, y: 0 }, // ------> second swap
        { x: 2, y: 1 }, // second row

        { x: 0, y: 1 }, // ------> first swap
      ]);
    });

    test("Move elm122 into elm4 position in the third col", async () => {
      await getDraggedRect(elm2);
      await moveDragged(-1, 140);
      await page.dispatchEvent("#id-3", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("All siblings are transformed into different cols", async () => {
      await Promise.all([
        expect(elm1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 105)"), // Second col
        expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 105)"), // third col
        expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 210)"), // Same col
        expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -105)"), // Second col
        expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -105)"), // third col
        expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -105)"), // Same col
        expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -105)"), // Same col
      ]);
    });

    test("elements grid is calculated correctly for three cols", async () => {
      test.skip(isProdBundle, SKIP_REASON);

      await assertChildrenGrid(elmParent, [
        { x: 0, y: 2 }, // ------> first swap
        { x: 1, y: 1 }, // ------> second swap
        { x: 2, y: 1 }, // ------> third swap

        { x: 0, y: 0 }, // ------> first swap
        { x: 1, y: 0 }, // ------> second swap
        { x: 2, y: 0 }, // ------> third swap

        { x: 0, y: 1 }, // ------> first swap
      ]);
    });

    test("Trigger key `c` to commit the transformed elements and read the emitted message for mutation", async () => {
      await invokeKeyboardAndAssertEmittedMsg(FINAL_IDS_ROUND_2);
    });

    test("Siblings have the correct DOM order in depth-1", async () => {
      await Promise.all([
        assertChildrenOrderIDs(elmParent, FINAL_IDS_ROUND_2),
        assertDefaultChildrenIndex(elmParent),
        isProdBundle
          ? Promise.resolve()
          : assertChildrenGrid(elmParent, INITIAL_GRID),
      ]);
    });
  });
});
