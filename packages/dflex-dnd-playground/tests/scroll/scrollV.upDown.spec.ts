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
} from "../utils";

test.describe.serial("Drag the first element down vertically", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elementSelectors: string[];
  let elements: Locator[];
  let visibleElements: Locator[];
  let invisibleElements: Locator[];

  let elmParent: Locator;

  let viewportHeight: number;

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

    [elements, viewportHeight] = await Promise.all([
      Promise.all(elementSelectors.map((selector) => page.locator(selector))),
      page.evaluate(() => window.innerHeight),
    ]);

    elmParent = page.locator("#dflex_id_0");
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "TODO.. If you see it please work on it."
  );

  test.skip(
    process.platform === "darwin",
    "TODO: test skipped on Mac devices."
  );

  test("Siblings index initiated correctly", async () => {
    await assertDefaultChildrenIndex(elmParent);
  });

  test("Move elm1 outside the container down into elm38", async () => {
    await getDraggedRect(elements[0]);
    await moveDragged(-220, -1);
    await moveDragged(-1, viewportHeight);
    await page.waitForTimeout(2000);
    await moveDragged(-1, viewportHeight / 2);
    await page.waitForTimeout(1000);
  });

  test("Only visible siblings are transformed", async () => {
    visibleElements = elements.slice(2, 30);

    await Promise.all(
      visibleElements.map((element) =>
        expect(element).toHaveCSS(
          "transform",
          "matrix(1, 0, 0, 1, 0, -59.1875)"
        )
      )
    );
  });

  test("Invisible siblings are not transformed", async () => {
    invisibleElements = elements.slice(50);

    await Promise.all(
      invisibleElements.map((element) =>
        expect(element).toHaveCSS("transform", "none")
      )
    );
  });

  test("Move elm1 outside the container down again", async () => {
    await moveDragged(-1, viewportHeight + 200);
    await page.waitForTimeout(1000);
  });

  test("All elements have been lifted up", async () => {
    visibleElements = elements.slice(2);

    await Promise.all(
      visibleElements.map((element) =>
        expect(element).toHaveCSS(
          "transform",
          "matrix(1, 0, 0, 1, 0, -59.1875)"
        )
      )
    );
  });

  test("Dispatch mouse up", async () => {
    await page.dispatchEvent("[id='1-extended']", "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Pending elements still hold their old positions", async () => {
    invisibleElements = elements.slice(1, 80);

    await Promise.all(
      invisibleElements.map((element) =>
        expect(element).toHaveCSS(
          "transform",
          "matrix(1, 0, 0, 1, 0, -59.1875)",
          TransformTimeout
        )
      )
    );
  });

  test("Non-Pending elements are back to their positions", async () => {
    visibleElements = elements.slice(90);

    await Promise.all(
      visibleElements.map((element) =>
        expect(element).toHaveCSS(
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
          TransformTimeout
        )
      )
    );
  });

  test("Scroll page from bottom to top", async () => {
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  });

  test("Visible elements in the top return to their position", async () => {
    visibleElements = elements.slice(0, 10);

    await Promise.all(
      visibleElements.map((element) =>
        expect(element).toHaveCSS(
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
          TransformTimeout
        )
      )
    );
  });
});
