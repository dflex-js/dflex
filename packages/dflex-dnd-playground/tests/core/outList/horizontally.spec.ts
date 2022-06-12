import { test, expect, Page, Locator } from "@playwright/test";
import { DraggedRect, getDraggedRect, initialize, moveDragged } from "../utils";

test.describe.serial(
  "Dragged is strictly out container list horizontally",
  async () => {
    let page: Page;

    const draggedID = "#id-9";

    let draggedRect: DraggedRect;

    let elm10: Locator;
    let elm09: Locator;
    let elm11: Locator;
    let elm12: Locator;

    [
      {
        url: "http://localhost:3001/",
        desc: "Testing Container Based Event",
      },
      {
        url: "http://localhost:3001/component-based-event",
        desc: "Testing Component Based Event",
      },
    ].forEach(async (testCase) => {
      test.describe(testCase.desc, async () => {
        test.beforeAll(async ({ browser }) => {
          const context = await browser.newContext();

          page = await context.newPage();
          initialize(page, 5);
          await page.goto(testCase.url);

          [elm09, elm10, elm11, elm12] = await Promise.all([
            page.locator("#id-9"),
            page.locator("#id-10"),
            page.locator("#id-11"),
            page.locator("#id-12"),
          ]);
        });

        test("Moving dragged element to the right", async () => {
          draggedRect = await getDraggedRect(elm09);
          await moveDragged(1.25 * draggedRect.width, -1);
        });

        test("All siblings are lifted up", async () => {
          await expect(elm10).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
          await expect(elm11).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
          await expect(elm12).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
        });

        test("Insert dragged from breaking point outside the container", async () => {
          await moveDragged(-1, 2 * draggedRect.height);
          await moveDragged(0, -1);
        });

        test("Siblings positioned correctly", async () => {
          await expect(elm10).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
          await expect(elm11).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
          await expect(elm12).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, 0)"
          );
        });

        test("Triggers mouseup", async () => {
          await page.dispatchEvent(draggedID, "mouseup", {
            button: 0,
            force: true,
          });
        });

        test("list elements positioned correctly", async () => {
          await expect(elm09).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, 116)"
          );
          await expect(elm10).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
          await expect(elm11).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
          await expect(elm12).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, 0)"
          );
        });
      });
    });
  }
);
