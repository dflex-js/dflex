import { test, expect, Page, Locator, BrowserContext } from "@playwright/test";
import { getDraggedRect, initialize, moveDragged } from "../../utils";

test.describe.serial(
  "Moves the element above the container testing threshold for coming back",
  async () => {
    let page: Page;
    let context: BrowserContext;

    const draggedID = "#id-9";

    let elm10: Locator;
    let elm09: Locator;
    let elm11: Locator;
    let elm12: Locator;

    test.beforeAll(async ({ browser, baseURL }) => {
      context = await browser.newContext();

      page = await context.newPage();
      initialize(page, 10);
      await page.goto(baseURL!);

      [elm09, elm10, elm11, elm12] = await Promise.all([
        page.locator("#id-9"),
        page.locator("#id-10"),
        page.locator("#id-11"),
        page.locator("#id-12"),
      ]);
    });

    test.afterAll(async () => {
      await page.close();
      await context.close();
    });

    test("Moving dragged element up outside the container", async () => {
      await getDraggedRect(elm09);
      await moveDragged(-1, -80);
    });

    test("All siblings are lifted up", async () => {
      await Promise.all([
        expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      ]);
    });

    test("Transform dragged back inside the threshold but outside position", async () => {
      await moveDragged(-1, -35);
    });

    test("Sibling must hold their positions", async () => {
      await Promise.all([
        expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      ]);
    });

    test("Triggers mouseup", async () => {
      await page.dispatchEvent(draggedID, "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Siblings are back to their positions", async () => {
      await Promise.all([
        expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      ]);
    });
  }
);
