import { test, expect, Page, Locator } from "@playwright/test";
import { DraggedRect, getDraggedRect, initialize, moveDragged } from "../utils";

test.describe.serial("Orphan dragged won't break", async () => {
  let page: Page;

  const draggedID = "#id-1";

  let draggedRect: DraggedRect;

  let elmP1: Locator;

  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();

    page = await context.newPage();
    initialize(page, 5);
    await page.goto(baseURL!);

    elmP1 = page.locator(draggedID);
  });

  test("Moving dragged element list horizontally and vertically", async () => {
    draggedRect = await getDraggedRect(elmP1);
    await moveDragged(draggedRect.width, draggedRect.height);
  });

  test("Triggers mouseup", async () => {
    await page.dispatchEvent(draggedID, "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Dragged is back to its origin", async () => {
    await expect(elmP1).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  });
});
