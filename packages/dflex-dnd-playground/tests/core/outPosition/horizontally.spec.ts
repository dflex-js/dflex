import { test, expect, Page, Locator } from "@playwright/test";

test.describe.serial("Dragged is out position horizontally", async () => {
  let page: Page;

  const draggedID = "#id-10";
  const steps = 3;

  let stepsX = 0;
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

      async function expectSiblingsPositions() {
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

        test("Triggers mouseup", async () => {
          await page.dispatchEvent(draggedID, "mouseup", {
            button: 0,
            force: true,
          });
        });

        test("Resets Siblings positions", async () => {
          await expect(elm09).toHaveCSS("transform", "none");
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
      }

      test.describe(`Moving horizontally container3`, () => {
        test.describe("Strictly out form the right", async () => {
          test("Moving dragged element to the right", async () => {
            await getDraggedRect(elm10);
            await moveMouseToDragged();
            stepsX = (2 / 3) * draggedRect.width + 2;
            await moveDragged();
          });

          await expectSiblingsPositions();
        });

        test.describe("Strictly out form the left", async () => {
          test("Moving dragged element to the left", async () => {
            await moveMouseToDragged();
            stepsX = -1 * (2 / 3) * draggedRect.width + 2;
            await moveDragged();
          });

          await expectSiblingsPositions();
        });

        test.describe("Slightly down, out form the right", async () => {
          test("Moving dragged element to the right", async () => {
            await moveMouseToDragged();
            stepsX = (2 / 3) * draggedRect.width + 2;
            stepsY = 10;
            await moveDragged();
          });

          await expectSiblingsPositions();
        });

        test.describe("Slightly down, out form the left", async () => {
          test("Moving dragged element to the left", async () => {
            await moveMouseToDragged();
            stepsX = -1 * (2 / 3) * draggedRect.width + 2;
            stepsY = 10;
            await moveDragged();
          });

          await expectSiblingsPositions();
        });

        test.describe("Slightly up, out form the right", async () => {
          test("Moving dragged element to the right", async () => {
            await moveMouseToDragged();
            stepsX = (2 / 3) * draggedRect.width + 2;
            stepsY = -10;
            await moveDragged();
          });

          await expectSiblingsPositions();
        });

        test.describe("Slightly up, out form the left", async () => {
          test("Moving dragged element to the left", async () => {
            await moveMouseToDragged();
            stepsX = -1 * (2 / 3) * draggedRect.width + 2;
            stepsY = -10;
            await moveDragged();
          });

          await expectSiblingsPositions();
        });
      });
    });
  });
});
