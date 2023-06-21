import { Page, Locator, BrowserContext, Browser } from "@playwright/test";

import {
  DFlexPageTest as test,
  assertChildrenOrderIDs,
  assertDefaultChildrenIndex,
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

  async function moveElmDown(elm: Locator, id: string) {
    await getDraggedRect(elm);
    await moveDragged(-1, 340);
    await page.dispatchEvent(id, "mouseup", {
      button: 0,
      force: true,
    });
  }

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
    let elmB00: Locator;

    test.beforeAll(async () => {
      [elmA00, elmB00] = await Promise.all([
        page.locator("#a-0-0"),
        page.locator("#b-0-0"),
      ]);
    });

    test("Siblings index initiated correctly round 2", async () => {
      await page.keyboard.press("r", { delay: 50 });

      await Promise.all([
        assertDefaultChildrenIndex(elmAParent),
        assertDefaultChildrenIndex(elmBParent),
      ]);
    });

    test("Transforms elements (#a-0-0) and (#b-0-0) - to the end", async () => {
      await moveElmDown(elmA00, "#a-0-0");
      await moveElmDown(elmB00, "#b-0-0");
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
        assertDefaultChildrenIndex(elmAParent),
        assertDefaultChildrenIndex(elmBParent),
      ]);
    });
  });

  test.describe("Next rounds initialized positions", () => {
    test("Siblings index initiated correctly round 2", async () => {
      await page.keyboard.press("r", { delay: 50 });

      await Promise.all([
        assertDefaultChildrenIndex(elmAParent),
        assertDefaultChildrenIndex(elmBParent),
      ]);
    });

    test("Siblings index initiated correctly round 3", async () => {
      await page.keyboard.press("r", { delay: 50 });

      await Promise.all([
        assertDefaultChildrenIndex(elmAParent),
        assertDefaultChildrenIndex(elmBParent),
      ]);
    });

    test.skip("Siblings index initiated correctly round 4", async () => {
      await page.keyboard.press("r", { delay: 50 });

      await Promise.all([
        assertDefaultChildrenIndex(elmAParent),
        assertDefaultChildrenIndex(elmBParent),
      ]);
    });
  });
});
