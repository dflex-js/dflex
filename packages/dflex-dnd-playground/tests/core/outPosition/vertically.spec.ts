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
} from "../../utils";

test.describe.serial("Dragged is out position vertically", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let draggedID = "#id-10";

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

      test.describe("Moving vertically container3", () => {
        test.describe("Strictly out form the bottom", async () => {
          test("Moving dragged element to the bottom", async () => {
            draggedRect = await getDraggedRect(elm10);
            await moveDragged(-1, (2 / 3) * draggedRect.height + 2);
          });

          test("Siblings have the correct position", async () => {
            await Promise.all([
              expect(elm09).toHaveCSS("transform", "none"),
              expect(elm11).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
              expect(elm12).toHaveCSS("transform", "none"),
            ]);
          });

          test("Triggers mouseup", async () => {
            await page.dispatchEvent(draggedID, "mouseup", {
              button: 0,
              force: true,
            });
          });

          test("Untransformed siblings not being effected", async () => {
            await Promise.all([
              expect(elm09).toHaveCSS("transform", "none"),
              expect(elm12).toHaveCSS("transform", "none"),
            ]);
          });

          test("affected siblings switched their positions", async () => {
            await Promise.all([
              expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
              expect(elm11).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
            ]);
          });
        });

        test.describe("Strictly out form top", async () => {
          test("Moving dragged element to the top", async () => {
            draggedRect = await getDraggedRect(elm10);
            await moveDragged(-1, -1 * (2 / 3) * draggedRect.height + 2);
          });

          test("Siblings have the correct position", async () => {
            await Promise.all([
              expect(elm09).toHaveCSS("transform", "none"),
              expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
              expect(elm12).toHaveCSS("transform", "none"),
            ]);
          });

          test("Triggers mouseup", async () => {
            await page.dispatchEvent(draggedID, "mouseup", {
              button: 0,
              force: true,
            });
          });

          test("Untransformed siblings not being effected", async () => {
            await Promise.all([
              expect(elm09).toHaveCSS("transform", "none"),
              expect(elm12).toHaveCSS("transform", "none"),
            ]);
          });

          test("affected siblings switched their positions", async () => {
            await Promise.all([
              expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
              expect(elm11).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
            ]);
          });
        });

        test.describe("Moving down multi siblings strictly", async () => {
          test("Moving dragged element down", async () => {
            draggedRect = await getDraggedRect(elm10);
            await moveDragged(-1, 2 * draggedRect.height);
          });

          test("Siblings have the correct position", async () => {
            await Promise.all([
              expect(elm09).toHaveCSS("transform", "none"),
              expect(elm11).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
              expect(elm12).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
            ]);
          });

          test("Moving dragged out the container, preservers the last transformation", async () => {
            await moveDragged(-1, 4 * draggedRect.height);
          });

          test("Siblings preserve their positions", async () => {
            await Promise.all([
              expect(elm09).toHaveCSS("transform", "none"),
              expect(elm11).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
              expect(elm12).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
            ]);
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
            await Promise.all([
              expect(elm12).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
              expect(elm11).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
            ]);
          });
        });

        test.describe("Moving up multi siblings strictly", async () => {
          test("Moving dragged element up", async () => {
            draggedID = "#id-11";
            draggedRect = await getDraggedRect(elm11);
            await moveDragged(-1, -3 * draggedRect.height);
          });

          test("Makes sure all siblings are lifted up to fill the gap", async () => {
            await Promise.all([
              expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
              expect(elm10).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 58)"),
              expect(elm12).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -116)"
              ),
            ]);
          });

          test("Triggers mouseup", async () => {
            await page.dispatchEvent(draggedID, "mouseup", {
              button: 0,
              force: true,
            });
          });

          test("Resets all positions considering leaving from above is not suitable", async () => {
            await Promise.all([
              expect(elm09).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)"),
              expect(elm10).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, 116)"
              ),
              expect(elm11).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
              expect(elm12).toHaveCSS(
                "transform",
                "matrix(1, 0, 0, 1, 0, -58)"
              ),
            ]);
          });
        });
      });
    });
  });
});
