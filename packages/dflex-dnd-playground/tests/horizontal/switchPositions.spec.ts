import {
  test,
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import {
  assertDefaultChildrenIndex,
  getDraggedRect,
  initialize,
  moveDragged,
} from "../utils";

test.describe("Stream incremental element then transform mutate and check the new positions", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elmGrandParent: Locator;

  let elmP1: Locator;
  let elmP2: Locator;
  let elmP3: Locator;

  test.beforeAll(async ({ browser, browserName, baseURL }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName);
    await page.goto(baseURL!);

    [elmGrandParent, elmP1, elmP2, elmP3] = await Promise.all([
      page.locator("#dflex_id_0"),
      page.locator("#id-p1"),
      page.locator("#id-p2"),
      page.locator("#id-p3"),
    ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Siblings index initiated correctly at depth: 1", async () => {
    await assertDefaultChildrenIndex(elmGrandParent);
  });

  test("Transforms element (#id-p3) to the left", async () => {
    await getDraggedRect(elmP3);
    await moveDragged(-230, -1);
    await page.dispatchEvent("#id-p3", "mouseup", {
      button: 0,
      force: true,
    });
  });
});
