import {
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
  ConsoleMessage,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  assertChildrenOrderIDs,
  assertConsoleMutationListener,
  assertDefaultChildrenIndex,
  // DraggedRect,
  getDraggedRect,
  initialize,
  // invokeKeyboardAndAssertEmittedMsg,
  moveDragged,
} from "dflex-e2e-utils";

test.describe("DFlex custom events", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elm1: Locator;

  const emittedEvents: {
    type: string;
    details: any;
  }[] = [];

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
      test.beforeAll(async () => {
        await getDraggedRect(elm1);
        await moveDragged(-1, -45);

        page.waitForTimeout(20000);
      });

      test.afterAll(async () => {
        emittedEvents.length = 0;
      });

      test("Emits ($onDragOutThreshold) when dragged is out threshold", async () => {
        const [outThreshold] = emittedEvents;

        const { details: { timestamp = "", ...rest } = {}, type } =
          outThreshold || {};

        expect(type).toEqual("$onDragOutThreshold");

        expect(rest).toEqual({
          category: "drag",
          id: "mtg",
          index: 0,
        });

        expect(typeof timestamp).toBe("number");
      });

      test("Emits ($onDragOutContainer) when dragged is out container", async () => {
        const [, outContainer] = emittedEvents;

        const { details: { timestamp = "", ...rest } = {}, type } =
          outContainer || {};

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
      test.beforeAll(async () => {
        await moveDragged(-1, 0);
        page.waitForTimeout(20000);
      });

      test.afterAll(async () => {
        emittedEvents.length = 0;
      });

      test("Emits ($onDragEnterContainer) when dragged enters container", async () => {
        console.log(emittedEvents);
        //   const [, inContainer] = emittedEvents;
        //   const { details: { timestamp = "", ...rest } = {}, type } =
        //     inContainer || {};
        //   expect(type).toEqual("$onDragEnterContainer");
        //   expect(rest).toEqual({
        //     category: "drag",
        //     id: "mtg",
        //     index: 0,
        //   });
        //   expect(typeof timestamp).toBe("number");
      });

      test("Emits ($onDragEnterThreshold) when dragged enters threshold", async () => {});
    });

    test("Emits ($onDragTransformed) when dragged transformed into new position", async () => {});
  });
});
