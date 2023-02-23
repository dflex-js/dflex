import {
  test,
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";

import {
  assertChildrenOrderIDs,
  getDraggedRect,
  initialize,
  moveDragged,
} from "../utils";

test.describe("Stream new element then transform mutate and check the new positions", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elmAParent: Locator;
  let elmBParent: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/stream-new");

    [elmAParent, elmBParent] = await Promise.all([
      page.locator("#dflex_id_0"),
      page.locator("#dflex_id_1"),
    ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test.describe("First round: 5 elements", () => {
    let elmA00: Locator;
    let elmA01: Locator;
    let elmA02: Locator;
    let elmA03: Locator;
    let elmA04: Locator;

    let elmB00: Locator;
    let elmB01: Locator;
    let elmB02: Locator;
    let elmB03: Locator;
    let elmB04: Locator;

    test.beforeAll(async () => {
      await page.keyboard.press("r", { delay: 50 });

      [
        elmA00,
        elmA01,
        elmA02,
        elmA03,
        elmA04,

        elmB00,
        elmB01,
        elmB02,
        elmB03,
        elmB04,
      ] = await Promise.all([
        page.locator("#a-0-0"),
        page.locator("#a-0-1"),
        page.locator("#a-0-2"),
        page.locator("#a-0-3"),
        page.locator("#a-0-4"),

        page.locator("#b-0-0"),
        page.locator("#b-0-1"),
        page.locator("#b-0-2"),
        page.locator("#b-0-3"),
        page.locator("#b-0-4"),
      ]);
    });

    async function moveElmDown(elm: Locator, id: string) {
      await getDraggedRect(elm);
      await moveDragged(-1, 340);
      await page.dispatchEvent(id, "mouseup", {
        button: 0,
        force: true,
      });
    }

    test("Siblings index initiated correctly", async () => {
      (
        await Promise.all([
          elmB00.getAttribute("data-index"),
          elmB01.getAttribute("data-index"),
          elmB02.getAttribute("data-index"),
          elmB03.getAttribute("data-index"),
          elmB04.getAttribute("data-index"),
        ])
      ).forEach((_, i) => {
        expect(_).toBe(`${i}`);
      });

      (
        await Promise.all([
          elmA00.getAttribute("data-index"),
          elmA01.getAttribute("data-index"),
          elmA02.getAttribute("data-index"),
          elmA03.getAttribute("data-index"),
          elmA04.getAttribute("data-index"),
        ])
      ).forEach((_, i) => {
        expect(_).toBe(`${i}`);
      });
    });

    test("Transforms elements (#a-0-0) and (#b-0-0) - to the end", async () => {
      await moveElmDown(elmA00, "#a-0-0");
      await moveElmDown(elmB00, "#b-0-0");
    });

    test("Siblings positioned correctly", async () => {
      (
        await Promise.all([
          elmB01.getAttribute("data-index"),
          elmB02.getAttribute("data-index"),
          elmB03.getAttribute("data-index"),
          elmB04.getAttribute("data-index"),
        ])
      ).forEach((_, i) => {
        expect(_).toBe(`${i}`);
      });

      (
        await Promise.all([
          elmA01.getAttribute("data-index"),
          elmA02.getAttribute("data-index"),
          elmA03.getAttribute("data-index"),
          elmA04.getAttribute("data-index"),
        ])
      ).forEach((_, i) => {
        expect(_).toBe(`${i}`);
      });

      (
        await Promise.all([
          elmA00.getAttribute("data-index"),
          elmB00.getAttribute("data-index"),
        ])
      ).forEach((_) => {
        expect(_).toBe("4");
      });
    });

    test("Siblings have the correct order in DOM", async () => {
      await Promise.all([
        assertChildrenOrderIDs(elmAParent, [
          "a-0-1",
          "a-0-2",
          "a-0-3",
          "a-0-4",
          "a-0-0",
        ]),
        assertChildrenOrderIDs(elmBParent, [
          "b-0-1",
          "b-0-2",
          "b-0-3",
          "b-0-4",
          "b-0-0",
        ]),
      ]);
    });
  });

  test.describe("Second round: 10 elements", () => {
    let elmA10: Locator;
    let elmA11: Locator;
    let elmA12: Locator;
    let elmA13: Locator;
    let elmA14: Locator;
    let elmA15: Locator;
    let elmA16: Locator;
    let elmA17: Locator;
    let elmA18: Locator;
    let elmA19: Locator;

    let elmB10: Locator;
    let elmB11: Locator;
    let elmB12: Locator;
    let elmB13: Locator;
    let elmB14: Locator;
    let elmB15: Locator;
    let elmB16: Locator;
    let elmB17: Locator;
    let elmB18: Locator;
    let elmB19: Locator;

    test.beforeAll(async () => {
      await page.keyboard.press("r", { delay: 50 });

      [
        elmA10,
        elmA11,
        elmA12,
        elmA13,
        elmA14,
        elmA15,
        elmA16,
        elmA17,
        elmA18,
        elmA19,

        elmB10,
        elmB11,
        elmB12,
        elmB13,
        elmB14,
        elmB15,
        elmB16,
        elmB17,
        elmB18,
        elmB19,
      ] = await Promise.all([
        page.locator("#a-1-0"),
        page.locator("#a-1-1"),
        page.locator("#a-1-2"),
        page.locator("#a-1-3"),
        page.locator("#a-1-4"),
        page.locator("#a-1-5"),
        page.locator("#a-1-6"),
        page.locator("#a-1-7"),
        page.locator("#a-1-8"),
        page.locator("#a-1-9"),

        page.locator("#b-1-0"),
        page.locator("#b-1-1"),
        page.locator("#b-1-2"),
        page.locator("#b-1-3"),
        page.locator("#b-1-4"),
        page.locator("#b-1-5"),
        page.locator("#b-1-6"),
        page.locator("#b-1-7"),
        page.locator("#b-1-8"),
        page.locator("#b-1-9"),
      ]);
    });

    test("Siblings index initiated correctly", async () => {
      await getDraggedRect(elmB10);
      await page.dispatchEvent("#b-1-0", "mouseup", {
        button: 0,
        force: true,
      });

      (
        await Promise.all([
          elmB10.getAttribute("data-index"),
          elmB11.getAttribute("data-index"),
          elmB12.getAttribute("data-index"),
          elmB13.getAttribute("data-index"),
          elmB14.getAttribute("data-index"),
          elmB15.getAttribute("data-index"),
          elmB16.getAttribute("data-index"),
          elmB17.getAttribute("data-index"),
          elmB18.getAttribute("data-index"),
          elmB19.getAttribute("data-index"),
        ])
      ).forEach((_, i) => {
        expect(_).toBe(`${i}`);
      });

      (
        await Promise.all([
          elmA10.getAttribute("data-index"),
          elmA11.getAttribute("data-index"),
          elmA12.getAttribute("data-index"),
          elmA13.getAttribute("data-index"),
          elmA14.getAttribute("data-index"),
          elmA15.getAttribute("data-index"),
          elmA16.getAttribute("data-index"),
          elmA17.getAttribute("data-index"),
          elmA18.getAttribute("data-index"),
          elmA19.getAttribute("data-index"),
        ])
      ).forEach((_, i) => {
        expect(_).toBe(`${i}`);
      });
    });
  });
});
