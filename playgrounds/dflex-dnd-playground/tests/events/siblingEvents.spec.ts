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

test.describe("DFlex custom Siblings events", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elm2: Locator;

  const emittedEvents: ConsoleEmittedEvent[] = [];

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/todo-with-events");

    [elm2] = await Promise.all([page.locator("#org")]);

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

  test.describe("out events", async () => {
    let liftUpSiblings: ConsoleEmittedEvent;

    test.beforeAll(async () => {
      await getDraggedRect(elm2);
      await moveDragged(-250, -1);

      await page.waitForTimeout(100);

      [, , liftUpSiblings] = emittedEvents;
    });

    test.afterAll(async () => {
      emittedEvents.length = 0;
      await page.evaluate(() => {
        // eslint-disable-next-line no-console
        console.clear();
      });
    });

    test("Emits ($onLiftUpSiblings) when dragged is out container", async () => {
      const { details: { timestamp = "", ...rest } = {}, type } =
        liftUpSiblings || {};

      expect(type).toEqual("$onLiftUpSiblings");

      expect(rest).toEqual({
        category: "siblings",
        siblings: ["mtg", "gym", ""],
        from: 1,
        to: 2,
      });

      expect(typeof timestamp).toBe("number");
    });
  });

  test.describe("in events", async () => {
    let moveDownSiblings: ConsoleEmittedEvent;

    test.beforeAll(async () => {
      await moveDragged(0, -1);
      await page.waitForTimeout(100);

      [, moveDownSiblings] = emittedEvents;
    });

    test.afterAll(async () => {
      emittedEvents.length = 0;
      await page.evaluate(() => {
        // eslint-disable-next-line no-console
        console.clear();
      });
    });

    test("Emits ($onMoveDownSiblings) when dragged enters container", async () => {
      const { details: { timestamp = "", ...rest } = {}, type } =
        moveDownSiblings || {};

      expect(type).toEqual("$onMoveDownSiblings");

      expect(rest).toEqual({
        category: "siblings",
        siblings: ["mtg", "", "gym"],
        from: 1,
        to: 2,
      });

      expect(typeof timestamp).toBe("number");
    });
  });
});
