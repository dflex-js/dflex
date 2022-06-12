import { test, expect, Page, Locator } from "@playwright/test";

test.describe.serial("Dragged is out position vertically", async () => {
  let page: Page;

  let draggedID = "#id-10";
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

      test.describe(`Moving vertically container3`, () => {
        test.describe("Strictly out form the bottom", async () => {
          test("Moving dragged element to the bottom", async () => {
            await getDraggedRect(elm10);
            await moveMouseToDragged();
            await page.mouse.move(
              startingPointX,
              startingPointY + ((2 / 3) * draggedRect.height + 2),
              {
                steps: 5,
              }
            );
          });

          test("Siblings have the correct position", async () => {
            await expect(elm09).toHaveCSS("transform", "none");
            await expect(elm11).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
            await expect(elm12).toHaveCSS("transform", "none");
          });

          test("Triggers mouseup", async () => {
            await page.dispatchEvent(draggedID, "mouseup", {
              button: 0,
              force: true,
            });
          });

          test("Untransformed siblings not being effected", async () => {
            await expect(elm09).toHaveCSS("transform", "none");
            await expect(elm12).toHaveCSS("transform", "none");
          });

          test("affected siblings switched their positions", async () => {
            await expect(elm10).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, 58)"
            );
            await expect(elm11).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
          });
        });

        test.describe("Strictly out form top", async () => {
          test("Moving dragged element to the top", async () => {
            await getDraggedRect(elm10);
            await moveMouseToDragged();
            await page.mouse.move(
              startingPointX,
              startingPointY - ((2 / 3) * draggedRect.height + 2),
              {
                steps: 5,
              }
            );
          });

          test("Siblings have the correct position", async () => {
            await expect(elm09).toHaveCSS("transform", "none");
            await expect(elm11).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, 0)"
            );
            await expect(elm12).toHaveCSS("transform", "none");
          });

          test("Triggers mouseup", async () => {
            await page.dispatchEvent(draggedID, "mouseup", {
              button: 0,
              force: true,
            });
          });

          test("Untransformed siblings not being effected", async () => {
            await expect(elm09).toHaveCSS("transform", "none");
            await expect(elm12).toHaveCSS("transform", "none");
          });

          test("affected siblings switched their positions", async () => {
            await expect(elm10).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, 0)"
            );
            await expect(elm11).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, 0)"
            );
          });
        });

        test.describe("Moving down multi siblings strictly", async () => {
          test("Moving dragged element down", async () => {
            await getDraggedRect(elm10);
            await moveMouseToDragged();
            await page.mouse.move(
              startingPointX,
              startingPointY + 2 * draggedRect.height,
              {
                steps: 10,
              }
            );
          });

          test("Siblings have the correct position", async () => {
            await expect(elm09).toHaveCSS("transform", "none");
            await expect(elm11).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
            await expect(elm12).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
          });

          test("Moving dragged out the container, preservers the last transformation", async () => {
            await page.mouse.move(
              startingPointX,
              startingPointY + 4 * draggedRect.height,
              {
                steps: 5,
              }
            );
          });

          test("Siblings preserve their positions", async () => {
            await expect(elm09).toHaveCSS("transform", "none");
            await expect(elm11).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
            await expect(elm12).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
          });

          test("Triggers mouseup", async () => {
            await page.dispatchEvent(draggedID, "mouseup", {
              button: 0,
              force: true,
            });
          });

          test("Untransformed siblings not being effected", async () => {
            await expect(elm09).toHaveCSS("transform", "none");
          });

          test("affected siblings switched their positions", async () => {
            await expect(elm12).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
            await expect(elm11).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
          });
        });

        test.describe("Moving up multi siblings strictly", async () => {
          test("Moving dragged element up", async () => {
            draggedID = "#id-11";
            await getDraggedRect(elm11);
            await moveMouseToDragged();
            await page.mouse.move(
              startingPointX,
              startingPointY - 3 * draggedRect.height,
              {
                steps: 5,
              }
            );
          });

          test("Makes sure all siblings are lifted up to fill the gap", async () => {
            await expect(elm09).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, 0)"
            );
            await expect(elm10).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, 58)"
            );
            await expect(elm12).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, -116)"
            );
          });

          test("Triggers mouseup", async () => {
            await page.dispatchEvent(draggedID, "mouseup", {
              button: 0,
              force: true,
            });
          });

          test("Resets all positions considering leaving from above is not suitable", async () => {
            await expect(elm09).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, 0)"
            );
            await expect(elm10).toHaveCSS(
              "transform",
              "matrix(1, 0, 0, 1, 0, 116)"
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
        });
      });
    });
  });
});
