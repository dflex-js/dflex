import {
  test,
  expect,
  Page,
  Locator,
  BrowserContext,
  // Browser,
} from "@playwright/test";
import {
  assertChildrenOrderIDs,
  assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  invokeKeyboardAndAssertEmittedMsg,
  moveDragged,
} from "../../utils";

test.describe
  .serial("Moving out then insert - Up/Down - No release", async () => {
  let page: Page;

  const draggedID = "#id-2";

  let elm2: Locator;
  let elm3: Locator;
  let elm4: Locator;
  let elm5: Locator;
  let elm6: Locator;
  let elm7: Locator;
  let elm8: Locator;
  let parentLocater: Locator;

  let context: BrowserContext;
  // let activeBrowser: Browser;

  const FINAL_IDS = ["id-3", "id-2", "id-4", "id-5", "id-6", "id-7", "id-8"];

  test.beforeAll(async ({ browser, baseURL, browserName }) => {
    context = await browser.newContext();
    page = await context.newPage();
    initialize(page, browserName);
    await page.goto(baseURL!);

    [parentLocater, elm2, elm3, elm4, elm5, elm6, elm7, elm8] =
      await Promise.all([
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

  test("Moving dragged element down two siblings", async () => {
    await getDraggedRect(elm2);
    await moveDragged(-180, -1);
    await moveDragged(-1, 120);
  });

  test("Siblings are lifted up", async () => {
    await Promise.all([
      expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm8).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
    ]);
  });

  test("Inserts the element inside the list at elm#4", async () => {
    await moveDragged(0, -1);
  });

  test("Siblings have new positions with first two are now switched", async () => {
    await Promise.all([
      expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm8).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
    ]);
  });

  test("Transforms the element down", async () => {
    await moveDragged(-1, 240);
  });

  test("Siblings have new positions with first four are now switched", async () => {
    await Promise.all([
      expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm8).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
    ]);
  });

  test("Transforms element back to top", async () => {
    await moveDragged(-190, -1);
    await moveDragged(-1, 45);
    await moveDragged(0, 45);
  });

  test("Triggers mouseup", async () => {
    await page.dispatchEvent(draggedID, "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Siblings positioned correctly", async () => {
    await Promise.all([
      expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
      expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm8).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
    ]);
  });

  test("Trigger key `c` to commit the transformed elements and read the emitted message for mutation", async () => {
    await invokeKeyboardAndAssertEmittedMsg(FINAL_IDS);
  });

  test("Siblings that still have the same origin positions have zero transformation", async () => {
    await Promise.all([
      expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm8).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
    ]);
  });

  test("Siblings that have reconciled don't have transformation", async () => {
    await Promise.all([
      expect(elm2).toHaveCSS("transform", "none"),
      expect(elm3).toHaveCSS("transform", "none"),
    ]);
  });

  test("Siblings have the correct order", async () => {
    await Promise.all([
      assertChildrenOrderIDs(parentLocater, FINAL_IDS),
      assertDefaultChildrenIndex(parentLocater),
    ]);
  });
});
