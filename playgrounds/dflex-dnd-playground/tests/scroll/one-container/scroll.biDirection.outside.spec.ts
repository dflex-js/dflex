import {
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  getDraggedRect,
  initialize,
  moveDragged,
  getSerializedElementsAfterKeyPress,
} from "dflex-e2e-utils";

type DFlexSerializedElements = Awaited<
  ReturnType<typeof getSerializedElementsAfterKeyPress>
>;

test.describe("Drag the first element down vertically testing visibility and threshold", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elementSelectors: string[];
  let elements: Locator[];
  let visibleElements: Locator[];
  let invisibleElements: Locator[];

  let invisibleElementsBeforeDrag: Locator[];

  let dflexElements: DFlexSerializedElements;
  let visibleDFlexElements: DFlexSerializedElements;
  let invisibleDFlexElements: DFlexSerializedElements;
  let invisibleDflexElementsBeforeDrag: DFlexSerializedElements;

  async function launchTestProcess(cb?: () => void) {
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

        expect(hasTransformedFromOrigin).toBeTruthy();
        expect(hasPendingTransformation).toBeFalsy();
        expect(isVisible).toBeTruthy();
      });
    });

    test("Visible elements have the correct translate", async () => {
      visibleDFlexElements.forEach((dflexElm) => {
        const { translate } = dflexElm;

        expect(translate).toEqual({
          x: 0,
          y: -59.1875,
        });
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
        expect(hasPendingTransformation).toBeTruthy();
        expect(isVisible).toBeFalsy();
      });
    });

    test("Invisible elements have the correct pending translate", async () => {
      invisibleDFlexElements.forEach((dflexElm) => {
        const { translate } = dflexElm;

        expect(translate).toEqual({
          x: 0,
          y: -59.1875,
        });
      });
    });

    test("Invisible elements before dragged have correct CSS transformation", async () => {
      await Promise.all(
        invisibleElementsBeforeDrag.map((element) =>
          expect(element).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, -59.1875)",
          ),
        ),
      );
    });

    test("Invisible elements before dragged have transformed internally", async () => {
      invisibleDflexElementsBeforeDrag.forEach((dflexElm) => {
        const {
          hasTransformedFromOrigin,
          hasPendingTransformation,
          isVisible,
        } = dflexElm;

        expect(hasTransformedFromOrigin).toBeTruthy();
        expect(hasPendingTransformation).toBeFalsy();
        expect(isVisible).toBeFalsy();
      });
    });

    if (cb) {
      cb();
    }
  }

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 150);
    await page.goto("/extended");

    elementSelectors = Array.from(
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
    test.beforeAll(async () => {
      // Drag it outside the container.
      await getDraggedRect(elements[0]);
      await moveDragged(-220, -1);

      await page.waitForTimeout(1000);

      dflexElements = await getSerializedElementsAfterKeyPress();

      // Slices elements from index 0 to 10 (inclusive)
      visibleDFlexElements = dflexElements.slice(1, 11);
      visibleElements = elements.slice(1, 11);

      // Generates elements from index 11 to the end but with 5
      // elements margin to take into consideration the threshold.
      invisibleElements = elements.slice(16);
      invisibleDFlexElements = dflexElements.slice(16);

      invisibleElementsBeforeDrag = [];
      invisibleDflexElementsBeforeDrag = [];
    });

    await launchTestProcess(() => {
      test("Invisible elements have not actually CSS transformed", async () => {
        await Promise.all(
          invisibleElements.map((element) =>
            expect(element).toHaveCSS("transform", "none"),
          ),
        );
      });
    });
  });

  test.describe("in the middle", async () => {
    test.beforeAll(async () => {
      // Move it to 50
      await moveDragged(-1, 600);
      await page.waitForTimeout(2700);
      await moveDragged(-1, 500);

      await page.waitForTimeout(1000);

      dflexElements = await getSerializedElementsAfterKeyPress();

      // Slices elements from index 50 to 60 (inclusive)
      visibleDFlexElements = dflexElements.slice(50, 61);
      visibleElements = elements.slice(50, 61);

      // Generates elements from index 0 to 44 and from 66 to the end but with 5
      // elements margin to take into consideration the threshold.

      invisibleElements = [...elements.slice(66)];
      invisibleDFlexElements = [...dflexElements.slice(66)];

      invisibleElementsBeforeDrag = [...elements.slice(1, 45)];
      invisibleDflexElementsBeforeDrag = [...dflexElements.slice(1, 45)];
    });

    await launchTestProcess();
  });

  test.describe("in the end", async () => {
    test.beforeAll(async () => {
      // Move it to 50
      await moveDragged(-1, 600);
      await page.waitForTimeout(2700);
      await moveDragged(-1, 500);

      await page.waitForTimeout(1000);

      dflexElements = await getSerializedElementsAfterKeyPress();

      // Slices elements from index 50 to 60 (inclusive)
      visibleDFlexElements = dflexElements.slice(90, dflexElements.length);
      visibleElements = elements.slice(90, elements.length);

      // Generates elements from index 0 to 44 and from 66 to the end but with 5
      // elements margin to take into consideration the threshold.

      invisibleElements = [];
      invisibleDFlexElements = [];

      invisibleElementsBeforeDrag = [...elements.slice(1, 85)];
      invisibleDflexElementsBeforeDrag = [...dflexElements.slice(1, 85)];
    });

    await launchTestProcess();
  });
});
