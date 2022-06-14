import { test, expect, Page, Locator, BrowserContext } from "@playwright/test";
import { getDraggedRect, initialize, moveDragged } from "../utils";

test.describe.serial(
  "Moves out, goes back to the same position, settles in, moves another element",
  async () => {
    let page: Page;
    let context: BrowserContext;

    let draggedID = "#id-9";

    let elm10: Locator;
    let elm09: Locator;
    let elm11: Locator;
    let elm12: Locator;

    test.beforeAll(async ({ browser, baseURL }) => {
      context = await browser.newContext();
      page = await context.newPage();
      initialize(page, 20);
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

    test("Moving dragged element down to the bottom", async () => {
      await getDraggedRect(elm09);
      await moveDragged(-1, 180);
    });

    test("All siblings are lifted up", async () => {
      await Promise.all([
        expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      ]);
    });

    test("Returns to the same old position", async () => {
      // TODO:
      // Fix this test, there's a bug if the dragged returns to the same
      // position 0, 0 then it fails to transform later on. It's a weird bug I
      // am not sure if it's a Playwright bug or if it's a bug in the test.
      await moveDragged(-1, 4);
    });

    test("Triggers mouseup", async () => {
      await page.mouse.up({ button: "left", clickCount: 1 });
    });

    test("Siblings are back to their positions", async () => {
      await Promise.all([
        expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      ]);
    });

    test("Dragging the second element elm#10 to the top outside the container", async () => {
      draggedID = "#id-10";
      await getDraggedRect(elm10);
      await moveDragged(0, -120);
    });

    test("Sibling must hold their positions", async () => {
      await Promise.all([
        expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      ]);
    });

    test("Moves Drag down to settle at the top of the list container", async () => {
      await moveDragged(0, -30);
    });

    test("Triggers mouseup for elm#10", async () => {
      await page.dispatchEvent(draggedID, "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("Siblings have new positions", async () => {
      Promise.all([
        expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
        expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
        expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
        expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      ]);
    });
  }
);
