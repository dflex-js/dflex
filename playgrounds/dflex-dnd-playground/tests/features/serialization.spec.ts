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
  // let invisibleElements: Locator[];

  let dflexElements: DFlexSerializedElements;
  let visibleDFlexElements: DFlexSerializedElements;
  let invisibleDFlexElements: DFlexSerializedElements;

  async function launchTestProcess() {
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
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          height: Math.round(rect.height),
          width: Math.round(rect.width),
        }).toEqual({
          x: Math.round(x),
          y: Math.round(y),
          height: Math.round(height),
          width: Math.round(width),
        });
      });
    });

    test("Visible elements have the correct flags", async () => {
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

    test("Invisible elements have the correct flags", async () => {
      invisibleDFlexElements.forEach((dflexElm) => {
        const {
          hasTransformedFromOrigin,
          hasPendingTransformation,
          isVisible,
        } = dflexElm;

        expect(hasTransformedFromOrigin).toBeFalsy();
        expect(hasPendingTransformation).toBeFalsy();
        expect(isVisible).toBeFalsy();
      });
    });

    test("Elements have the correct translate", async () => {
      dflexElements.forEach((dflexElm) => {
        const { translate } = dflexElm;

        expect(translate).toEqual({
          x: 0,
          y: 0,
        });
      });
    });
  }

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

  test.describe("in the top", async () => {
    test.beforeAll(async ({ browserName }) => {
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      // Reloading in another browsers will move scroll to the start.
      if (browserName === "chromium") {
        await page.reload();
        await page.waitForLoadState();
      }

      await page.waitForTimeout(1000);

      dflexElements = await getSerializedElementsAfterKeyPress();
      await page.waitForTimeout(1000);

      // Slices elements from index 0 to 10 (inclusive)
      visibleDFlexElements = dflexElements.slice(0, 11);
      visibleElements = elements.slice(0, 11);

      // Generates elements from index 11 to the end but with 5
      // elements margin to take into consideration the threshold.
      invisibleDFlexElements = dflexElements.slice(16);
    });

    await launchTestProcess();
  });

  test.describe("in the middle", async () => {
    test.beforeAll(async ({ browserName }) => {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });

      // Reloading in another browsers will move scroll to the start.
      if (browserName === "chromium") {
        await page.reload();
        await page.waitForLoadState();
      }

      await page.waitForTimeout(1000);

      dflexElements = await getSerializedElementsAfterKeyPress();
      await page.waitForTimeout(1000);

      // Slices elements from index 50 to 60 (inclusive)
      visibleDFlexElements = dflexElements.slice(50, 61);
      visibleElements = elements.slice(50, 61);

      // Generates elements from index 0 to 44 and from 66 to the end but with 5
      // elements margin to take into consideration the threshold.
      invisibleDFlexElements = [
        ...dflexElements.slice(0, 45),
        ...dflexElements.slice(66),
      ];
    });

    await launchTestProcess();
  });

  test.describe("in the end", async () => {
    test.beforeAll(async ({ browserName }) => {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Reloading in another browsers will move scroll to the start.
      if (browserName === "chromium") {
        await page.reload();
        await page.waitForLoadState();
      }

      await page.waitForTimeout(1000);

      dflexElements = await getSerializedElementsAfterKeyPress();
      await page.waitForTimeout(1000);

      // Slices elements from index 90 to 100 (inclusive)
      visibleDFlexElements = dflexElements.slice(90, dflexElements.length);
      visibleElements = elements.slice(90, elements.length);

      // Generates elements from index 0 to 85 with 5 elements margin to take
      // into consideration the threshold.
      invisibleDFlexElements = dflexElements.slice(0, 85);
    });

    await launchTestProcess();
  });
});
