import {
  test,
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";

import {
  assertChildrenOrderIDs,
  assertConsoleMsg,
  // DraggedRect,
  getDraggedRect,
  initialize,
  // invokeKeyboardAndAssertEmittedMsg,
  moveDragged,
} from "../utils";

test.describe
  .serial("Resizing window will automatically reconcile elements and refresh elements DOMRect", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  // Second container.
  let elmC2Parent: Locator;
  let elmC2E1: Locator;
  let elmC2E2: Locator;
  let elmC2E3: Locator;
  let elmC2E4: Locator;
  let elmC2E5: Locator;

  // Third container
  let elmC3Parent: Locator;
  let elmC3E1: Locator;
  let elmC3E2: Locator;

  let originalViewport: {
    width: number;
    height: number;
  };

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/migration");

    [
      elmC3Parent,
      elmC3E1,
      elmC3E2,

      elmC2Parent,
      elmC2E1,
      elmC2E2,
      elmC2E3,
      elmC2E4,
      elmC2E5,
    ] = await Promise.all([
      page.locator("#id-p3"),
      page.locator("#c3-1"),
      page.locator("#c3-2"),

      page.locator("#id-p2"),
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

  test.describe("Migrating (#c3-2) and commit it to the C2 container", () => {
    test("Transforms element (#c3-2) - outside the origin container(3) inside container(2)", async () => {
      await getDraggedRect(elmC3E2);
      await moveDragged(-230, -1);
      await page.dispatchEvent("#c3-2", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Siblings from the destination and original container positioned correctly including (#c3-2)", async () => {
      await Promise.all([
        expect(elmC3E1).toHaveCSS("transform", "none"),
        expect(elmC3E2).toHaveCSS("transform", "matrix(1, 0, 0, 1, -226, 12)"),

        expect(elmC2E1).toHaveCSS("transform", "none"),
        expect(elmC2E2).toHaveCSS("transform", "none"),
        expect(elmC2E3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
        expect(elmC2E4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
        expect(elmC2E5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
      ]);
    });

    test("Resize the viewport window triggers reconciliation", async () => {
      originalViewport = page.viewportSize()!;

      page.setViewportSize({ width: 640, height: 800 });

      await assertConsoleMsg(["c3-1"]);
    });

    test("Siblings have the correct order in destination container(C2) including the new merged element (#c3-2)", async () => {
      await Promise.all([
        assertChildrenOrderIDs(elmC3Parent, ["c3-1"]),
        assertChildrenOrderIDs(elmC2Parent, [
          "c2-1",
          "c2-2",
          "c3-2", // The new child.
          "c2-3",
          "c2-4",
          "c2-5",
        ]),
      ]);
    });
  });

  test.describe("Migrating (#c3-1) and commit it to the C2 container", () => {
    test("Transforms element (#c3-1) - outside the origin container(3) inside container(2)", async () => {
      await getDraggedRect(elmC3E1);
      await moveDragged(-230, -1);
      await page.dispatchEvent("#c3-1", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Siblings from the destination and original container positioned correctly including (#c3-1)", async () => {
      await Promise.all([
        expect(elmC3E1).toHaveCSS("transform", "matrix(1, 0, 0, 1, -226, 0)"),

        expect(elmC2E1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
        expect(elmC2E2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
        expect(elmC3E2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"), // Previously merged.
        expect(elmC2E3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
        expect(elmC2E4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
        expect(elmC2E5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 112)"),
      ]);
    });

    test("Restore the viewport window triggers reconciliation", async () => {
      page.setViewportSize(originalViewport);

      await assertConsoleMsg([]);
    });

    test("Siblings have the correct order in destination container(C2) including the new merged element (#c3-1)", async () => {
      await Promise.all([
        assertChildrenOrderIDs(elmC3Parent, []),
        assertChildrenOrderIDs(elmC2Parent, [
          "c3-1", // The new child.
          "c2-1",
          "c2-2",
          "c3-2", // The previously merged child.
          "c2-3",
          "c2-4",
          "c2-5",
        ]),
      ]);
    });
  });

  test.describe("Transforming elements inside C2 container", () => {
    test("Transforms element (#c3-1) outside the container", async () => {
      await getDraggedRect(elmC3E1);
      await moveDragged(-1, -100);
    });

    test("All siblings are lifted up", async () => {
      await Promise.all([
        expect(elmC3E2).not.toHaveCSS("transform", "none"),
        expect(elmC2E1).not.toHaveCSS("transform", "none"),
        expect(elmC2E2).not.toHaveCSS("transform", "none"),
        expect(elmC2E3).not.toHaveCSS("transform", "none"),
        expect(elmC2E4).not.toHaveCSS("transform", "none"),
        expect(elmC2E5).not.toHaveCSS("transform", "none"),
      ]);
    });

    test("Release dragged", async () => {
      await page.dispatchEvent("#c3-1", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("siblings are back to zero position", async () => {
      await Promise.all([
        expect(elmC3E1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elmC3E2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elmC2E1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elmC2E2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elmC2E3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elmC2E4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elmC2E5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      ]);
    });
  });
});
