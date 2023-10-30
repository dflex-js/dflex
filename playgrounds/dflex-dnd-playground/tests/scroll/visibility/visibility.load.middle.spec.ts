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
} from "dflex-e2e-utils";

test.describe("Visible elements have transformation after loading in the the middle then execute", async () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Other browsers will move scroll to the beginning.",
  );

  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elementSelectors: string[];
  let elements: Locator[];
  let visibleElements: Locator[];
  let invisibleElements: Locator[];

  let elmParent: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/extended");

    elementSelectors = Array.from(
      { length: 100 },
      (_, index) => `[id='${index + 1}-extended']`,
    );

    elements = await Promise.all(
      elementSelectors.map((selector) => page.locator(selector)),
    );

    visibleElements = elements.slice(2, 13); // Extract elements from index 2 to index 12
    invisibleElements = elements.slice(14); // Extract elements from index 14 onwards

    elmParent = page.locator("#dflex_id_0");
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Siblings index initiated correctly", async () => {
    await assertDefaultChildrenIndex(elmParent);
  });

  test("Scroll page to the middle to check visibility updater", async () => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForTimeout(1000);
  });

  test("Move elm51 outside the container", async () => {
    await getDraggedRect(elements[50]);

    await moveDragged(-220, -1);

    await page.dispatchEvent("[id='51-extended']", "mouseup", {
      button: 0,
      force: true,
    });

    await page.waitForTimeout(1000);
  });

  test("Visible elements have transformed", async () => {
    visibleElements = elements.slice(50, 64); // Extract elements from index 2 to index 12

    await Promise.all(
      visibleElements.map((element) =>
        expect(element).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      ),
    );
  });

  test("Invisible elements below 51 don't have any transformation", async () => {
    invisibleElements = elements.slice(0, 50);

    await Promise.all(
      invisibleElements.map((element) =>
        expect(element).toHaveCSS("transform", "none"),
      ),
    );
  });

  test("Invisible elements above 65 don't have any transformation", async () => {
    invisibleElements = elements.slice(66, 101);

    await Promise.all(
      invisibleElements.map((element) =>
        expect(element).toHaveCSS("transform", "none"),
      ),
    );
  });
});
