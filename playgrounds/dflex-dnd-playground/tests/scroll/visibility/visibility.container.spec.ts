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
  // assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  moveDragged,
} from "dflex-e2e-utils";

test.describe("The container is scrollable only when it's not visible", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elementSelectors: string[];
  let elements: Locator[];

  let scrollTop = 0;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 100);
    await page.goto("/scrollable-page");

    elementSelectors = Array.from(
      { length: 4 },
      (_, index) => `[id='id_${index}']`,
    );

    elements = await Promise.all(
      elementSelectors.map((selector) => page.locator(selector)),
    );
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Move elm1 outside the container then scroll to the end", async () => {
    await getDraggedRect(elements[0]);
    await moveDragged(-270, -1);
    await moveDragged(-1, 200);
    await page.waitForFunction(() => {
      ({ scrollTop } = document.documentElement);

      return scrollTop >= 280;
    });

    await moveDragged(-1, -25);
  });

  test("the page is scrolled by the dragged", async () => {
    scrollTop = await page.evaluate(() => document.documentElement.scrollTop);

    expect(scrollTop).toBeGreaterThan(100);
  });

  test("insert drag into the bottom of the container", async () => {
    await moveDragged(0, -1);

    await page.dispatchEvent(elementSelectors[0], "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Siblings transformed their positions", async () => {
    await Promise.all([
      expect(elements[0]).not.toHaveCSS("transform", "none"),
      expect(elements[1]).not.toHaveCSS("transform", "none"),
      expect(elements[2]).not.toHaveCSS("transform", "none"),
      expect(elements[3]).not.toHaveCSS("transform", "none"),
    ]);
  });

  test("get the current top scroll value", async () => {
    scrollTop = await page.evaluate(() => document.documentElement.scrollTop);
  });

  test("Move elm2 which is located first outside the container then scroll to the top", async () => {
    await getDraggedRect(elements[1]);
    await moveDragged(-270, -1);
    await moveDragged(-1, -200);

    await page.waitForTimeout(2000);
  });

  test("the page hasn't scrolled because container is visible", async () => {
    const currentScrollTop = await page.evaluate(
      () => document.documentElement.scrollTop,
    );

    expect(currentScrollTop).toBe(scrollTop);
  });
});
