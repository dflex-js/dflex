import {
  test,
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";
import {
  DraggedRect,
  getDraggedRect,
  initialize,
  moveDragged,
} from "dflex-e2e-utils";

test.describe.serial("Dragged is out position horizontally", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  const draggedID = "#id-10";

  let draggedRect: DraggedRect;

  let elm10: Locator;
  let elm09: Locator;
  let elm11: Locator;
  let elm12: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName);

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
    // await activeBrowser.close();
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

      async function expectSiblingsPositions() {
        test("Siblings have the correct position", async () => {
          await Promise.all([
            expect(elm09).toHaveCSS("transform", "none"),
            expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
            expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -58)"),
          ]);
        });

        test("Triggers mouseup", async () => {
          await page.dispatchEvent(draggedID, "mouseup", {
            button: 0,
            force: true,
          });
        });

        test("Resets Siblings positions", async () => {
          await Promise.all([
            expect(elm09).toHaveCSS("transform", "none"),
            expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
            expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
            expect(elm12).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
          ]);
        });
      }

      test.describe("Moving horizontally container3", () => {
        test.describe("Strictly out form the right", async () => {
          test("Moving dragged element to the right", async () => {
            draggedRect = await getDraggedRect(elm10);
            await moveDragged((2 / 3) * draggedRect.width + 2, -1);
          });
          await expectSiblingsPositions();
        });

        test.describe("Strictly out form the left", async () => {
          test("Moving dragged element to the left", async () => {
            draggedRect = await getDraggedRect(elm10);
            await moveDragged(-1 * (2 / 3) * draggedRect.width + 2, -1);
          });
          await expectSiblingsPositions();
        });

        test.describe("Slightly down, out form the right", async () => {
          test("Moving dragged element to the right", async () => {
            draggedRect = await getDraggedRect(elm10);
            await moveDragged((2 / 3) * draggedRect.width + 2, 10);
          });
          await expectSiblingsPositions();
        });

        test.describe("Slightly down, out form the left", async () => {
          test("Moving dragged element to the left", async () => {
            draggedRect = await getDraggedRect(elm10);
            await moveDragged(-1 * (2 / 3) * draggedRect.width + 2, -1);
          });

          await expectSiblingsPositions();
        });

        test.describe("Slightly up, out form the right", async () => {
          test("Moving dragged element to the right", async () => {
            draggedRect = await getDraggedRect(elm10);
            await moveDragged((2 / 3) * draggedRect.width + 2, -10);
          });
          await expectSiblingsPositions();
        });

        test.describe("Slightly up, out form the left", async () => {
          test("Moving dragged element to the left", async () => {
            draggedRect = await getDraggedRect(elm10);
            await moveDragged(-1 * (2 / 3) * draggedRect.width + 2, -1);
          });
          await expectSiblingsPositions();
        });
      });
    });
  });
});
