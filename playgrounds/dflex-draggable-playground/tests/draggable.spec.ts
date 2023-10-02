/* eslint-disable no-underscore-dangle */
import {
  Page,
  BrowserContext,
  Browser,
  expect,
  Locator,
} from "@playwright/test";

import {
  getDraggedRect,
  initialize,
  moveDragged,
  DFlexPageTest as test,
} from "dflex-e2e-utils";

test.describe("Draggable only", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;
  let btn: Locator;

  test.beforeAll(async ({ browser, baseURL }) => {
    activeBrowser = browser;
    context = await activeBrowser.newContext();
    page = await context.newPage();
    await page.goto(baseURL!);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test("Drag the button", async ({ browserName }) => {
    initialize(page, browserName, 50);
    btn = page.locator("#DFlex-draggable-solo");
    await getDraggedRect(btn);
    await moveDragged(180, 180);
  });

  test("Drag has updated position", async () => {
    const textContent = await btn.textContent();
    expect(textContent).toBe("Being dragged");
    expect(btn).toHaveCSS("transform", "matrix(1, 0, 0, 1, 180, 180)");
  });

  test("Release the button", async () => {
    await page.dispatchEvent("#DFlex-draggable-solo", "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("button text is back", async () => {
    const textContent = await btn.textContent();
    expect(textContent).toBe("Drag me");
  });
});
