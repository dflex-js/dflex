import { test, expect, Page, Locator, BrowserContext } from "@playwright/test";
import { DraggedRect, getDraggedRect, initialize, moveDragged } from "../utils";

test.describe.serial(
  "Dragged is strictly out container list vertically",
  async () => {
    let page: Page;
    let context: BrowserContext;

    const draggedID = "#id-9";

    let draggedRect: DraggedRect;

    let elm10: Locator;
    let elm09: Locator;
    let elm11: Locator;
    let elm12: Locator;

    test.beforeAll(async ({ browser }) => {
      context = await browser.newContext();

      page = await context.newPage();
      initialize(page, 5);

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
        test.beforeAll(async () => {
          await page.goto(testCase.url);
        });

        async function siblingsBack() {
          await expect(elm10).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, 0)"
          );
          await expect(elm11).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, 0)"
          );
          await expect(elm12).toHaveCSS(
            "transform",
            "matrix(1, 0, 0, 1, 0, 0)"
          );
        }

        test("Moving dragged element to the bottom of the list", async () => {
          draggedRect = await getDraggedRect(elm09);
          await moveDragged(0, 4 * draggedRect.height);
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

        test("Moving dragged element to the top again", async () => {
          await moveDragged(0, 0);
        });

        test("All siblings are back to their positions", async () => {
          await siblingsBack();
        });

        test("Triggers mouseup", async () => {
          await page.dispatchEvent(draggedID, "mouseup", {
            button: 0,
            force: true,
          });
        });

        test("All siblings are back to their positions again", async () => {
          await siblingsBack();
        });
      });
    });
  }
);
