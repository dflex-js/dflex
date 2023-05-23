import {
  test,
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  //   assertChildrenOrderIDs,
  assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  moveDragged,
} from "../utils";

test.describe.serial("Visible elements have transformation test", async () => {
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
      (_, index) => `[id='${index + 1}-extended']`
    );

    elements = await Promise.all(
      elementSelectors.map((selector) => page.locator(selector))
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

  test("Move elm1 outside the container", async () => {
    await getDraggedRect(elements[0]);
    await moveDragged(-270, -1);
  });

  test("Only visible siblings are transformed", async ({ browserName }) => {
    const expectedResult =
      browserName === "firefox"
        ? "matrix(1, 0, 0, 1, 0, -59.2)"
        : "matrix(1, 0, 0, 1, 0, -59.1875)";

    await Promise.all(
      visibleElements.map((element) =>
        expect(element).toHaveCSS("transform", expectedResult)
      )
    );
  });

  test("Invisible siblings are not transformed", async () => {
    await Promise.all(
      invisibleElements.map((element) =>
        expect(element).toHaveCSS("transform", "none")
      )
    );
  });

  test("Release dragged", async () => {
    await page.dispatchEvent("[id='1-extended']", "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Visible siblings return to initial positions", async () => {
    await Promise.all(
      visibleElements.map((element) =>
        expect(element).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)")
      )
    );
  });

  test("Invisible elements don't have any transformation", async () => {
    await Promise.all(
      invisibleElements.map((element) =>
        expect(element).toHaveCSS("transform", "none")
      )
    );
  });

  test("Scroll page to the middle", async () => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
  });

  test("Move elm51 one step down inside the container", async () => {
    await getDraggedRect(elements[50]);
    await moveDragged(-1, 65);
    await page.dispatchEvent("[id='51-extended']", "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Invisible elements below 51 don't have any transformation", async () => {
    invisibleElements = elements.slice(60); // Extract elements from index 14 onwards

    await Promise.all(
      invisibleElements.map((element) =>
        expect(element).toHaveCSS("transform", "none")
      )
    );
  });

  test("Scroll page to the end and check the non-transformed elements", async () => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await Promise.all(
      invisibleElements.map((element) =>
        expect(element).toHaveCSS("transform", "none")
      )
    );
  });
});
