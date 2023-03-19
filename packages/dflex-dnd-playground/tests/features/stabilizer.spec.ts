import {
  test,
  Page,
  Locator,
  BrowserContext,
  Browser,
  expect,
} from "@playwright/test";

import { getDraggedRect, initialize, moveDragged } from "../utils";

test.describe("Testing stabilizer between two intersected thresholds", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  // let elmParent: Locator;
  let elm1: Locator;
  let elm2: Locator;
  let elm3: Locator;
  let elm4: Locator;
  let elm5: Locator;
  let elm6: Locator;
  let elm7: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/grid");

    [elm1, elm2, elm3, elm4, elm5, elm6, elm7] = await Promise.all([
      page.locator("#id-p2"),
      page.locator("#id-2"),
      page.locator("#id-3"),
      page.locator("#id-4"),
      page.locator("#id-5"),
      page.locator("#id-6"),
      page.locator("#id-7"),
      page.locator("#id-8"),
    ]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test.describe("Moving element into intersection without being locked in dead zone", () => {
    test("Move elm3 into elm2 threshold", async () => {
      await getDraggedRect(elm3);
      await moveDragged(-130, -1);
    });

    test("Elm2 is transformed into the new position", async () => {
      await expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)");
    });

    test("Continue the movement of elm3 in the same direction", async () => {
      await moveDragged(-140, -1);
      await expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)");

      await moveDragged(-150, -1);
      await expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)");

      await moveDragged(-160, -1);
      await expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)");

      await moveDragged(-170, -1);
      await expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 255, 0)");
    });

    test("Changing the movement direction will unlock the zone forcing element to go back to its origin", async () => {
      await moveDragged(-140, -1);
      await expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
      await page.dispatchEvent("#id-4", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Rest of the siblings are not effected", async () => {
      await Promise.all([
        expect(elm1).toHaveCSS("transform", "none"),
        expect(elm4).toHaveCSS("transform", "none"),
        expect(elm5).toHaveCSS("transform", "none"),
        expect(elm6).toHaveCSS("transform", "none"),
        expect(elm7).toHaveCSS("transform", "none"),
      ]);
    });
  });
});
