import {
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  assertChildrenOrderIDs,
  assertDefaultChildrenIndex,
  // DraggedRect,
  getDraggedRect,
  initialize,
  invokeKeyboardAndAssertEmittedMsg,
  moveDragged,
} from "dflex-e2e-utils";

test.describe
  .serial("Migrate element into new container reconcile then migrate to its origin container when it's empty", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  // First container
  let elmC1Parent: Locator;
  let elmC1E1: Locator;

  // Second container.
  let elmC2Parent: Locator;
  let elmC2E1: Locator;
  let elmC2E2: Locator;
  let elmC2E3: Locator;
  let elmC2E4: Locator;
  let elmC2E5: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/migration");

    [
      elmC1Parent,
      elmC1E1,

      elmC2Parent,
      elmC2E1,
      elmC2E2,
      elmC2E3,
      elmC2E4,
      elmC2E5,
    ] = await Promise.all([
      page.locator("#id-p1"),
      page.locator("#c1-1"),

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

  test.describe("Migrating (#c1-1) and commit it to the C2 container", () => {
    test("Transforms element (#c1-1) - outside the origin container(1) inside container(2)", async () => {
      await getDraggedRect(elmC1E1);
      await moveDragged(230, -1);
      await page.dispatchEvent("#c1-1", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Siblings from the destination and original container positioned correctly including (#c1-1)", async () => {
      await Promise.all([
        expect(elmC1E1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 226, 0)"),

        expect(elmC2E1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 92)"),
        expect(elmC2E2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 92)"),
        expect(elmC2E3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 92)"),
        expect(elmC2E4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 92)"),
        expect(elmC2E5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 92)"),
      ]);
    });

    test("Trigger key `c` to commit the transformed elements and read the emitted message for mutation caused by (#c1-1)", async () => {
      await invokeKeyboardAndAssertEmittedMsg([
        "c1-1",
        "c2-1",
        "c2-2",
        "c2-3",
        "c2-4",
        "c2-5",
      ]);
    });

    test("Siblings have the correct order in destination container(C2) including the new merged element (#c1-1)", async () => {
      await Promise.all([
        assertChildrenOrderIDs(elmC1Parent, []),
        assertChildrenOrderIDs(elmC2Parent, [
          "c1-1", // The new child.
          "c2-1",
          "c2-2",
          "c2-3",
          "c2-4",
          "c2-5",
        ]),
        assertDefaultChildrenIndex(elmC1Parent),
        assertDefaultChildrenIndex(elmC2Parent),
      ]);
    });
  });

  test.describe("Migrating (#c1-1) back to the empty C2 container", () => {
    test("Transforms element (#c1-1) - outside the origin container(1) inside container(2)", async () => {
      await getDraggedRect(elmC1E1);
      await moveDragged(-230, -1);
      await page.dispatchEvent("#c1-1", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Trigger key `c` to commit the transformed elements and read the emitted message for mutation caused by (#c1-1)", async ({
      browserName,
    }) => {
      await invokeKeyboardAndAssertEmittedMsg(["c1-1"]);

      if (browserName === "firefox") {
        await page.waitForTimeout(2000);
      }
    });

    test("Siblings in both containers are reconciled", async ({
      browserName,
    }) => {
      test.skip(browserName === "firefox", "Keeps failing on Mac/firefox.");

      await Promise.all([
        expect(elmC1E1).toHaveCSS("transform", "none"),

        expect(elmC2E1).toHaveCSS("transform", "none"),
        expect(elmC2E2).toHaveCSS("transform", "none"),
        expect(elmC2E3).toHaveCSS("transform", "none"),
        expect(elmC2E4).toHaveCSS("transform", "none"),
        expect(elmC2E5).toHaveCSS("transform", "none"),
      ]);
    });

    test("Siblings have the correct order in destination container(C2) including the new merged element (#c1-1)", async () => {
      await Promise.all([
        assertChildrenOrderIDs(elmC1Parent, [
          "c1-1", // It's back.
        ]),
        assertChildrenOrderIDs(elmC2Parent, [
          "c2-1",
          "c2-2",
          "c2-3",
          "c2-4",
          "c2-5",
        ]),
        assertDefaultChildrenIndex(elmC1Parent),
        assertDefaultChildrenIndex(elmC2Parent),
      ]);
    });
  });
});
