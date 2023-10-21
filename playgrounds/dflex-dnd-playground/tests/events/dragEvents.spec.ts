import {
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  getDraggedRect,
  initialize,
  moveDragged,
} from "dflex-e2e-utils";

type ConsoleEmittedEvent = {
  type: string;
  details: any;
};

test.describe("DFlex custom events", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elm1: Locator;

  const emittedEvents: ConsoleEmittedEvent[] = [];

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/todo-with-events");

    [elm1] = await Promise.all([page.locator("#mtg")]);
    page.on("console", async (msg) => {
      const args = msg.args();

      if (args.length === 2) {
        const typeText = await args[0].jsonValue();

        // Ignore another log messages
        if (typeText.includes("onDFlexEvent")) {
          const matches = typeText.match(/onDFlexEvent:\s(\$[^\s]+)/);

          let extractedType = "";

          if (matches && matches.length === 2) {
            [, extractedType] = matches;
          }

          const payloadJson = await args[1].jsonValue();

          const i = { type: extractedType, details: payloadJson };

          emittedEvents.push(i);
        }
      }
    });
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test.describe("Drag events", async () => {
    test.describe("out events", async () => {
      let outThresholdEvent: ConsoleEmittedEvent;
      let outContainerEvent: ConsoleEmittedEvent;

      test.beforeAll(async () => {
        await getDraggedRect(elm1);
        await moveDragged(-1, -45);

        await page.waitForTimeout(100);

        [outThresholdEvent, outContainerEvent] = emittedEvents;
      });

      test.afterAll(async () => {
        emittedEvents.length = 0;
        await page.evaluate(() => {
          // eslint-disable-next-line no-console
          console.clear();
        });
      });

      test("Emits ($onDragOutThreshold) when dragged is out threshold", async () => {
        const { details: { timestamp = "", ...rest } = {}, type } =
          outThresholdEvent || {};

        expect(type).toEqual("$onDragOutThreshold");

        expect(rest).toEqual({
          category: "drag",
          id: "mtg",
          index: 0,
        });

        expect(typeof timestamp).toBe("number");
      });

      test("Emits ($onDragOutContainer) when dragged is out container", async () => {
        const { details: { timestamp = "", ...rest } = {}, type } =
          outContainerEvent || {};

        expect(type).toEqual("$onDragOutContainer");

        expect(rest).toEqual({
          category: "drag",
          id: "mtg",
          index: 0,
        });

        expect(typeof timestamp).toBe("number");
      });
    });

    test.describe("in events", async () => {
      let inThresholdEvent: ConsoleEmittedEvent;
      let inContainerEvent: ConsoleEmittedEvent;

      test.beforeAll(async () => {
        await moveDragged(-1, 0);
        await page.waitForTimeout(100);

        [inContainerEvent /* onMoveSiblings */, , inThresholdEvent] =
          emittedEvents;
      });

      test.afterAll(async () => {
        emittedEvents.length = 0;
        await page.evaluate(() => {
          // eslint-disable-next-line no-console
          console.clear();
        });
      });

      test("Emits ($onDragEnterContainer) when dragged enters container", async () => {
        const { details: { timestamp = "", ...rest } = {}, type } =
          inContainerEvent || {};

        expect(type).toEqual("$onDragEnterContainer");

        expect(rest).toEqual({
          category: "drag",
          id: "mtg",
          index: 0,
        });

        expect(typeof timestamp).toBe("number");
      });

      test("Emits ($onDragEnterThreshold) when dragged enters threshold", async () => {
        const { details: { timestamp = "", ...rest } = {}, type } =
          inThresholdEvent || {};

        expect(type).toEqual("$onDragEnterThreshold");

        expect(rest).toEqual({
          category: "drag",
          id: "mtg",
          index: 0,
        });

        expect(typeof timestamp).toBe("number");
      });
    });

    test.describe("mutation event", async () => {
      let transformEvent: ConsoleEmittedEvent;

      test.beforeAll(async () => {
        await getDraggedRect(elm1);
        await moveDragged(-1, 70);
        await page.dispatchEvent("#mtg", "mouseup", {
          button: 0,
          force: true,
        });

        await page.waitForTimeout(100);

        // eslint-disable-next-line prefer-destructuring
        transformEvent = emittedEvents[4];
      });

      test.afterAll(async () => {
        emittedEvents.length = 0;
      });

      test("Emits ($onDragTransformed) when dragged transformed into new position", async () => {
        const { details: { timestamp = "", ...rest } = {}, type } =
          transformEvent || {};

        expect(type).toEqual("$onDragTransformed");

        expect(rest).toEqual({
          category: "drag",
          element: "ref: <Node>",
          containers: {
            origin: "ref: <Node>",
            target: "ref: <Node>",
          },
          indexes: {
            initial: 0,
            inserted: 1,
          },
        });

        expect(typeof timestamp).toBe("number");
      });
    });
  });
});
