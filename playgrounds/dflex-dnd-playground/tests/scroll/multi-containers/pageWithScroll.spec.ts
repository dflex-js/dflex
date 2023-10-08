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
} from "dflex-e2e-utils";

test.describe
  .serial("Transform multiple elements from their container to another", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elementIDsA: string[];
  //   let elementIDsB: string[];

  let elementsA: Locator[];
  //   let elementsB: Locator[];

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
    "TODO.. If you see it please work on it.",
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

    const mergedIDs = [...movedIDsElmA, ...iDsElmB];

    await Promise.all([
      assertChildrenOrderIDs(parentB, mergedIDs),
      assertDefaultChildrenIndex(parentB),
    ]);
  });
});
