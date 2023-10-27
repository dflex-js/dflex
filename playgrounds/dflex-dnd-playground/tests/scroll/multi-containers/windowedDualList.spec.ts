import {
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  //   assertChildrenOrderIDs,
  assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  moveDragged,
  TransformTimeout,
  assertChildrenOrderIDs,
  invokeKeyboardAndAssertEmittedMsg,
} from "dflex-e2e-utils";

test.describe
  .serial("Transform multiple elements from their container to another", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elementIDsA: string[];
  let elementsA: Locator[];

  let mergedIDs: string[];
  let mergedElements: Locator[];

  let parentA: Locator;
  let parentB: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/windowed-dual-list");

    // Updated function for element IDs in list A
    elementIDsA = Array.from(
      { length: 15 },
      (_, index) => `[id='list-a-${index + 1}']`,
    );

    // Updated function for element IDs in list B
    // elementIDsB = Array.from(
    //   { length: 15 },
    //   (_, index) => `[id='list-b-${index + 1}']`,
    // );

    [elementsA, parentA, parentB] = await Promise.all([
      Promise.all(elementIDsA.map((selector) => page.locator(selector))),
      page.locator("#dflex_id_0"),
      page.locator("#dflex_id_1"),
    ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Each browser may exhibit different behavior regarding scroll numbers and distances. " +
      "This test case is currently optimized for Chromium-based browsers.",
  );

  test.skip(
    process.platform === "darwin",
    "Test skipped on Mac devices. Mac scroll implemented with different numbers.",
  );

  test("Siblings index initiated correctly", async () => {
    await Promise.all([
      assertDefaultChildrenIndex(parentA),
      assertDefaultChildrenIndex(parentA),
    ]);
  });

  test("Move elm-a-1 into the begging of container-b", async () => {
    await getDraggedRect(elementsA[0]);
    await moveDragged(450, -1);
    await page.dispatchEvent(elementIDsA[0], "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Move elm-a-2 into the begging of container-b", async () => {
    await getDraggedRect(elementsA[1]);
    await moveDragged(450, -1);
    await page.dispatchEvent(elementIDsA[1], "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Move elm-a-3 into the begging of container-b", async () => {
    await getDraggedRect(elementsA[2]);
    await moveDragged(450, -1);
    await page.dispatchEvent(elementIDsA[2], "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Move elm-a-4 into the begging of container-b", async () => {
    await getDraggedRect(elementsA[3]);
    await moveDragged(450, -1);
    await page.dispatchEvent(elementIDsA[3], "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Elements from parent-a are reconciled", async () => {
    const remainingElementsA = elementsA.slice(4);

    await Promise.all(
      remainingElementsA.map((element) =>
        expect(element).toHaveCSS("transform", "none", TransformTimeout),
      ),
    );
  });

  test("Elements from parent-a have the correct order", async () => {
    const startIdx = 5;
    const endIdx = 15;

    const remainingIDsElmA = Array.from(
      { length: endIdx - startIdx + 1 },
      (_, index) => `list-a-${startIdx + index}`,
    );

    await Promise.all([
      assertChildrenOrderIDs(parentA, remainingIDsElmA),
      assertDefaultChildrenIndex(parentA),
    ]);
  });

  test("Elements from parent-b have the correct order", async () => {
    const startIdxA = 1;
    const endIdxA = 4;

    const movedIDsElmA = Array.from(
      { length: endIdxA - startIdxA + 1 },
      (_, index) => `list-a-${startIdxA + index}`,
    ).reverse();

    const startIdxB = 1;
    const endIdxB = 15;

    const iDsElmB = Array.from(
      { length: endIdxB - startIdxB + 1 },
      (_, index) => `list-b-${startIdxB + index}`,
    );

    mergedIDs = [...movedIDsElmA, ...iDsElmB];

    await Promise.all([
      assertChildrenOrderIDs(parentB, mergedIDs),
      assertDefaultChildrenIndex(parentB),
    ]);
  });

  test("Move elm-a-4 down to the container-b bottom", async () => {
    await getDraggedRect(elementsA[3]);
    await moveDragged(-1, 600);
    await page.waitForTimeout(2000);
    await moveDragged(-1, 420);
    await page.waitForTimeout(2000);
    await page.dispatchEvent(elementIDsA[0], "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("elements in container-b have the correct position", async () => {
    mergedElements = mergedIDs
      .filter((id) => id !== "list-a-4")
      .map((id) => page.locator(`[id='${id}']`));

    await Promise.all(
      mergedElements.map(async (element) => {
        await expect(element).toHaveCSS(
          "transform",
          "matrix(1, 0, 0, 1, 0, -59.1875)",
          TransformTimeout,
        );
      }),
    );
  });

  test("Trigger key `c` to commit the transformed elements", async () => {
    await invokeKeyboardAndAssertEmittedMsg([
      "list-a-3",
      "list-a-2",
      "list-a-1",
      "list-b-1",
      "list-b-2",
      "list-b-3",
      "list-b-4",
      "list-b-5",
      "list-b-6",
      "list-b-7",
      "list-b-8",
      "list-b-9",
      "list-b-10",
      "list-b-11",
      "list-b-12",
      "list-b-13",
      "list-b-14",
      "list-b-15",
      "list-a-4",
    ]);
  });
});
