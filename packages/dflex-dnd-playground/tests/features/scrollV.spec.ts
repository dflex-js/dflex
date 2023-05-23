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
  //   assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  moveDragged,
} from "../utils";

test.describe.serial("Drag the first element down vertically", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elementSelectors: string[];
  let elements: Locator[];
  let visibleElements: Locator[];
  let invisibleElements: Locator[];

  //   let elmParent: Locator;

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
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test.skip(
    ({ browserName }) => browserName === "firefox",
    "TODO.. If you see it please work on it."
  );

  test("Move elm1 outside the container down into elm38", async () => {
    await getDraggedRect(elements[0]);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    await moveDragged(-220, -1);
    await moveDragged(-1, viewportHeight);
    await page.waitForTimeout(1000);
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
});
