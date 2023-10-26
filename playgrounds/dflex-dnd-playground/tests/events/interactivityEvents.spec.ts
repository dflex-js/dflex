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

test.describe("DFlex custom Interactivity events", async () => {
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

  test.describe("switch positions", async () => {
    let overElm: ConsoleEmittedEvent;
    let leaveElm: ConsoleEmittedEvent;

    test.beforeAll(async () => {
      await getDraggedRect(elm1);
      await moveDragged(-1, 70);

      await page.waitForTimeout(100);

      [, overElm, leaveElm] = emittedEvents;
    });

    test.afterAll(async () => {
      emittedEvents.length = 0;
      await page.evaluate(() => {
        // eslint-disable-next-line no-console
        console.clear();
      });
    });

    test("Emits ($onDragOver) when dragged is out container", async () => {
      const { details: { timestamp = "", ...rest } = {}, type } = overElm || {};

      expect(type).toEqual("$onDragOver");

      expect(rest).toEqual({
        category: "interactivity",
        id: "org",
        index: 1,
        drag: "ref: <Node>",
        target: "ref: <Node>",
      });

      expect(typeof timestamp).toBe("number");
    });

    test("Emits ($onDragLeave) when dragged enters container", async () => {
      const { details: { timestamp = "", ...rest } = {}, type } =
        leaveElm || {};

      expect(type).toEqual("$onDragLeave");

      expect(rest).toEqual({
        category: "interactivity",
        id: "org",
        index: 0,
        drag: "ref: <Node>",
        target: "ref: <Node>",
      });

      expect(typeof timestamp).toBe("number");
    });
  });
});
