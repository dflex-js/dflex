import { test, expect, Page, Locator, BrowserContext } from "@playwright/test";
import { DraggedRect, getDraggedRect, initialize, moveDragged } from "../utils";

test.describe.serial("Drag and release multiples positions", async () => {
  let page: Page;
  let context: BrowserContext;

  //   const draggedID = "#id-9";

  let draggedRect: DraggedRect;

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

  test("Moving dragged element to the switch with elm#10", async () => {
    draggedRect = await getDraggedRect(elm09);
    await moveDragged(-1, draggedRect.height);
    await page.mouse.up();
  });

  test("Dragged switched with elm#10", async () => {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm11).toHaveCSS("transform", "none"),
      expect(elm12).toHaveCSS("transform", "none"),
    ]);
  });

  test("Moving dragged element to the switch with elm#11", async () => {
    draggedRect = await getDraggedRect(elm09);
    await moveDragged(-1, draggedRect.height);
    await page.mouse.up();
  });

  test("Dragged switched with elm#11", async () => {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 116)"),
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm12).toHaveCSS("transform", "none"),
    ]);
  });

  test("Moving dragged element to the switch with elm#12", async () => {
    draggedRect = await getDraggedRect(elm09);
    await moveDragged(-1, draggedRect.height);
    await page.mouse.up();
  });

  test("Dragged switched with elm#12", async () => {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 174)"),
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
      expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
    ]);
  });
});
