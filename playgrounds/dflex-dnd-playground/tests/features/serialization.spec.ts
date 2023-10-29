import {
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  initialize,
  getSerializedElementsAfterKeyPress,
} from "dflex-e2e-utils";

type DFlexSerializedElements = Awaited<
  ReturnType<typeof getSerializedElementsAfterKeyPress>
>;

test.describe("Visible elements have transformation after loading in the the middle then execute", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elements: Locator[];
  let visibleElements: Locator[];

  let dflexElements: DFlexSerializedElements;
  let visibleDFlexElements: DFlexSerializedElements;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/extended");

    const elementSelectors = Array.from(
      { length: 100 },
      (_, index) => `[id='${index + 1}-extended']`,
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

  test.describe("in the middle", () => {
    test.beforeAll(async () => {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await page.reload();
      await page.waitForTimeout(500);
      dflexElements = await getSerializedElementsAfterKeyPress();
      await page.waitForTimeout(500);

      // Slices elements from index 50 to 60 (inclusive)
      visibleDFlexElements = dflexElements.slice(50, 61);
      visibleElements = elements.slice(50, 61);
    });

    test("DFlex Rect matches elements live Rect", async () => {
      const boundingClientRectPromise = visibleElements.map((l) =>
        l.boundingBox(),
      );

      const boundingClientRect = await Promise.all(boundingClientRectPromise);

      visibleDFlexElements.forEach((dflexElm, i) => {
        const { rect } = dflexElm;

        const liveRect = boundingClientRect[i];

        const { x, y, height, width } = liveRect!;

        expect({
          x: rect.left,
          y: rect.top,
          height: rect.height,
          width: rect.width,
        }).toEqual({
          x,
          y,
          height,
          width,
        });
      });
    });

    test.skip("Visible elements have the correct flags", async () => {
      visibleDFlexElements.forEach((dflexElm) => {
        const {
          hasTransformedFromOrigin,
          hasPendingTransformation,
          isVisible,
        } = dflexElm;

        expect(hasTransformedFromOrigin).toBeFalsy();
        expect(hasPendingTransformation).toBeFalsy();
        expect(isVisible).toBeTruthy();
      });
    });
  });
});
