import {
  test,
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  assertChildrenOrderIDs,
  assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  moveDragged,
} from "../utils";

test.describe("Stream incremental element then transform mutate and check the new positions", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elmAParent: Locator;
  let elmBParent: Locator;
  let elmA00: Locator;
  let elmB00: Locator;

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
    await page.goto("/stream-inc");

    [elmAParent, elmA00, elmBParent, elmB00] = await Promise.all([
      page.locator("#dflex_id_0"),
      page.locator("#a-0"),
      page.locator("#dflex_id_1"),
      page.locator("#b-0"),
    ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test.describe("First round: 5 elements", () => {
    test.beforeAll(async () => {
      await page.keyboard.press("r", { delay: 50 });
    });

    test("Siblings index initiated correctly", async () => {
      await Promise.all([
        assertDefaultChildrenIndex(elmAParent),
        assertDefaultChildrenIndex(elmBParent),
      ]);
    });

    test("Transforms elements (#a-0) and (#b-0) - to the end", async () => {
      await moveElmDown(elmA00, "#a-0");
      await moveElmDown(elmB00, "#b-0");
    });

    test("Siblings have the correct order in DOM", async () => {
      const idsA: string[] = [];
      const idsB: string[] = [];

      for (let i = 1; i < 5; i += 1) {
        idsA.push(`a-${i}`);
        idsB.push(`b-${i}`);
      }

      idsA.push("a-0");
      idsB.push("b-0");

      await Promise.all([
        assertChildrenOrderIDs(elmAParent, idsA),
        assertChildrenOrderIDs(elmBParent, idsB),
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

    test("Siblings index initiated correctly round 4", async () => {
      await page.keyboard.press("r", { delay: 50 });

      await Promise.all([
        assertDefaultChildrenIndex(elmAParent),
        assertDefaultChildrenIndex(elmBParent),
      ]);
    });

    test("Reconciled elements preserve their positions", async () => {
      (
        await Promise.all([
          elmA00.getAttribute("data-index"),
          elmB00.getAttribute("data-index"),
        ])
      ).forEach((_) => {
        expect(_).toBe("4");
      });
    });
  });
});
