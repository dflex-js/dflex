import { test, expect, Page, Locator } from "@playwright/test";
import {
  DraggedRect,
  getDraggedRect,
  initialize,
  moveDragged,
} from "../../utils";

test.describe.serial("Dragging from bottom up", async () => {
  let page: Page;

  const draggedID = "#id-9";

  let draggedRect: DraggedRect;

  let elm10: Locator;
  let elm09: Locator;
  let elm11: Locator;
  let elm12: Locator;

  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();

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

  test("Moving dragged element outside its position", async () => {
    draggedRect = await getDraggedRect(elm09);
    await moveDragged(draggedRect.height + 2, draggedRect.height + 2);
  });

  test("Only lifts elm#10 up", async () => {
    await Promise.all([
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm11).toHaveCSS("transform", "none"),
      expect(elm12).toHaveCSS("transform", "none"),
    ]);
  });

  test("Continue transformation to the bottom outside the container", async () => {
    await moveDragged(180, 180);
  });

  test("Transforms all elements up", async () => {
    await Promise.all([
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
    ]);
  });

  test("Insert dragged into elm#12 breaking point", async () => {
    await moveDragged(0, 180);
  });

  test("Triggers mouseup", async () => {
    await page.dispatchEvent(draggedID, "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Siblings positioned correctly", async () => {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 174)"),
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
    ]);
  });
});
