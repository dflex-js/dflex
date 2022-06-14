import { test, expect, Page, Locator } from "@playwright/test";
import { getDraggedRect, initialize, moveDragged } from "../utils";

test.describe.serial.only(
  "Moving out then insert - Up/Down - Release",
  async () => {
    let page: Page;

    const draggedID = "#id-2";

    let elm2: Locator;
    let elm3: Locator;
    let elm4: Locator;
    let elm5: Locator;
    let elm6: Locator;
    let elm7: Locator;
    let elm8: Locator;

    test.beforeAll(async ({ browser, baseURL, browserName }) => {
      const context = await browser.newContext();

      page = await context.newPage();
      initialize(page, browserName === "webkit" ? 30 : 10);
      await page.goto(baseURL!);

      [elm2, elm3, elm4, elm5, elm6, elm7, elm8] = await Promise.all([
        page.locator("#id-2"),
        page.locator("#id-3"),
        page.locator("#id-4"),
        page.locator("#id-5"),
        page.locator("#id-6"),
        page.locator("#id-7"),
        page.locator("#id-8"),
      ]);
    });

    test("Moving dragged element down two siblings", async () => {
      await getDraggedRect(elm2);
      await moveDragged(-180, -1);
      await moveDragged(-1, 120);
      await moveDragged(0, -1);
    });

    test("Triggers mouseup", async () => {
      await page.dispatchEvent(draggedID, "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Siblings have new positions with first two are now switched", async () => {
      await Promise.all([
        expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm8).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      ]);
    });

    test("Moving dragged element form its new position down two siblings", async () => {
      await getDraggedRect(elm2);
      await moveDragged(-180, -1);
      await moveDragged(-1, 120);
      await moveDragged(0, -1);
    });

    test("Triggers mouseup again", async () => {
      await page.dispatchEvent(draggedID, "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Siblings have new positions with four positions switched", async () => {
      await Promise.all([
        expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm8).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      ]);
    });

    test("Moving dragged element to the end", async () => {
      await getDraggedRect(elm2);
      await moveDragged(-180, -1);
      await moveDragged(-1, 120);
      await moveDragged(0, -1);
    });

    test("Triggers mouseup when it's in the last", async () => {
      await page.dispatchEvent(draggedID, "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Siblings with dragged have new positions with all of them are lifted up", async () => {
      await Promise.all([
        expect(elm2).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 348)"),

        expect(elm3).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm4).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm5).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm6).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm7).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm8).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      ]);
    });
  }
);
