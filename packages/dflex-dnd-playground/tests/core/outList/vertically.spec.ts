import { test, expect, Page, Locator } from "@playwright/test";

test.describe.serial(
  "Dragged is strictly out container list vertically",
  async () => {
    let page: Page;

    const draggedID = "#id-9";
    const steps = 50;

    const stepsX = 0;
    let stepsY = 0;

    let draggedRect: { x: number; y: number; width: number; height: number };

    let elm10: Locator;
    let elm09: Locator;
    let elm11: Locator;
    let elm12: Locator;

    let startingPointX: number;
    let startingPointY: number;

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
          await page.goto(testCase.url);

          elm09 = page.locator("#id-9");
          elm10 = page.locator("#id-10");
          elm11 = page.locator("#id-11");
          elm12 = page.locator("#id-12");
        });

        async function getDraggedRect(dragged: Locator) {
          // @ts-ignore
          draggedRect = await dragged.boundingBox();

          startingPointX = draggedRect.x + draggedRect.width / 2;
          startingPointY = draggedRect.y + draggedRect.height / 2;
        }

        async function moveMouseToDragged() {
          await page.mouse.move(startingPointX, startingPointY, {
            steps: 1,
          });

          await page.mouse.down({ button: "left", clickCount: 1 });
        }

        async function moveDragged() {
          await page.mouse.move(
            startingPointX + stepsX,
            startingPointY + stepsY,
            {
              steps,
            }
          );
        }

        test("Moving dragged element to the bottom of the list", async () => {
          await getDraggedRect(elm09);
          await moveMouseToDragged();
          stepsY = 4 * draggedRect.height;
          await moveDragged();
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
          stepsY = 0;
          await moveDragged();
        });

        test("All siblings are back to their positions", async () => {
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
        });

        test("Triggers mouseup", async () => {
          await page.dispatchEvent(draggedID, "mouseup", {
            button: 0,
            force: true,
          });
        });

        test("All siblings are back to their positions again", async () => {
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
        });
      });
    });
  }
);
