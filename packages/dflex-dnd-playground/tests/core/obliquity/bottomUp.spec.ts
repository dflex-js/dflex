import { test, expect, Page, Locator } from "@playwright/test";
import { getDraggedRect, initialize, moveDragged } from "../../utils";

test.describe.serial("Dragging from bottom up", async () => {
  let page: Page;

  const draggedID = "#id-12";

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
    await getDraggedRect(elm12);
    await moveDragged(-35, -35);
  });

  test("Checking the stability of the new positions", async () => {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "none"),
      expect(elm10).toHaveCSS("transform", "none"),
      expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
    ]);
  });

  test("Continue transformation to the top below #9", async () => {
    await moveDragged(-90, -90);
  });

  test("Transform elm#10 and elm#11 once it's entering the threshold", async () => {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "none"),
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
      expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
    ]);
  });

  test("Continue transformation to the top outside the container", async () => {
    await moveDragged(-190, -190);
  });

  test("Transform elm#10 and elm#11 back to their positions", async () => {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "none"),
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
      expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
    ]);
  });

  test("Insert dragged into elm#9 breaking point", async () => {
    await moveDragged(0, -190);
  });

  test("Triggers mouseup", async () => {
    await page.dispatchEvent(draggedID, "mouseup", {
      button: 0,
      force: true,
    });
  });

  test("Siblings positioned correctly", async () => {
    await Promise.all([
      expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
      expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
      expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
      expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -174)"),
    ]);
  });
});
