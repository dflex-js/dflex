import {
  test,
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";

import {
  DraggedRect,
  getDraggedRect,
  initialize,
  invokeKeyboardAndAssertEmittedMsg,
  moveDragged,
} from "../../utils";

test.describe
  .serial("Transitioning the last element into the bottom of a bigger container horizontally", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let draggedRect: DraggedRect;

  // Second container.
  let elmC2_1: Locator;
  let elmC2_2: Locator;
  let elmC2_3: Locator;
  let elmC2_4: Locator;
  let elmC2_5: Locator;

  // Third container
  let elmC3_1: Locator;
  let elmC3_2: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName);
    await page.goto("/migration");

    [elmC3_1, elmC3_2, elmC2_1, elmC2_2, elmC2_3, elmC2_4, elmC2_5] =
      await Promise.all([
        page.locator("#c3-1"),
        page.locator("#c3-2"),
        page.locator("#c2-1"),
        page.locator("#c2-2"),
        page.locator("#c2-3"),
        page.locator("#c2-4"),
        page.locator("#c2-5"),
      ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Transforms element (#c3-2) - outside the origin container(3) inside container(2)", async () => {
    draggedRect = await getDraggedRect(elmC3_2);
    await moveDragged(-230, -1);
  });

  test("Triggers mouseup", async () => {
    await page.mouse.up({ button: "left", clickCount: 1 });
  });

  test("Siblings from the original container positioned correctly", async () => {
    await Promise.all([
      expect(elmC3_1).toHaveCSS("transform", "none"),
      expect(elmC3_2).toHaveCSS("transform", "matrix(1, 0, 0, 1, -226, 12)"),
    ]);
  });

  test("Siblings from the destination container positioned correctly", async () => {
    await Promise.all([
      expect(elmC2_1).toHaveCSS("transform", "none"),
      expect(elmC2_2).toHaveCSS("transform", "none"),
      expect(elmC2_3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
      expect(elmC2_4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
      expect(elmC2_5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
    ]);
  });

  // test("Trigger key `c` to commit the transformed elements and read the emitted message for mutation", async () => {
  //   await invokeKeyboardAndAssertEmittedMsg([]);
  // });
});
