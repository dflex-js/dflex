import {
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";

import {
  DFlexPageTest as test,
  getDraggedRect,
  initialize,
  moveDragged,
} from "dflex-e2e-utils";

test.describe("DFlex custom DOM attributes", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let elm1: Locator;

  test.beforeAll(async ({ browser, browserName }) => {
    activeBrowser = browser;

    context = await activeBrowser.newContext();
    page = await context.newPage();
    initialize(page, browserName, 50);
    await page.goto("/todo-with-events");

    [elm1] = await Promise.all([page.locator("#mtg")]);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  test.describe("out container attributes", async () => {
    test.beforeAll(async () => {
      await getDraggedRect(elm1);
      await moveDragged(-1, -45);
    });

    test("dragged element has dragged attr", async () => {
      const hasDraggedAttr = await elm1.evaluate((el) =>
        el.hasAttribute("dragged"),
      );

      expect(hasDraggedAttr).toBeTruthy();
    });

    test("dragged has out-threshold attr when it's out threshold", async () => {
      const hasOutThresholdAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-threshold"),
      );

      expect(hasOutThresholdAttr).toBeTruthy();
    });

    test("dragged has out-container attr when it's out container", async () => {
      const hasOutContainerAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-container"),
      );

      expect(hasOutContainerAttr).toBeTruthy();
    });
  });

  test.describe("release without repositioning", async () => {
    test.beforeAll(async () => {
      await page.dispatchEvent("#mtg", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("dragged element removed dragged attr", async () => {
      const hasDraggedAttr = await elm1.evaluate((el) =>
        el.hasAttribute("dragged"),
      );

      expect(hasDraggedAttr).toBeFalsy();
    });

    test("dragged removed out-threshold attr", async () => {
      const hasOutThresholdAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-threshold"),
      );

      expect(hasOutThresholdAttr).toBeFalsy();
    });

    test("dragged removed out-container attr", async () => {
      const hasOutContainerAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-container"),
      );

      expect(hasOutContainerAttr).toBeFalsy();
    });
  });

  test.describe("out threshold attributes", async () => {
    test.beforeAll(async () => {
      await getDraggedRect(elm1);
      await moveDragged(-1, 44);
    });

    test("dragged element has dragged attr", async () => {
      const hasDraggedAttr = await elm1.evaluate((el) =>
        el.hasAttribute("dragged"),
      );

      expect(hasDraggedAttr).toBeTruthy();
    });

    test("dragged has out-threshold attr when it's out threshold", async () => {
      const hasOutThresholdAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-threshold"),
      );

      expect(hasOutThresholdAttr).toBeTruthy();
    });

    test("dragged doesn't have out-container attr because it's inside the container", async () => {
      const hasOutContainerAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-container"),
      );

      expect(hasOutContainerAttr).toBeFalsy();
    });
  });

  test.describe("new position", async () => {
    test.beforeAll(async () => {
      await getDraggedRect(elm1);
      await moveDragged(-1, 70);
    });

    test("dragged element has dragged attr", async () => {
      const hasDraggedAttr = await elm1.evaluate((el) =>
        el.hasAttribute("dragged"),
      );

      expect(hasDraggedAttr).toBeTruthy();
    });

    test("dragged has out-threshold attr when it's out threshold", async () => {
      const hasOutThresholdAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-threshold"),
      );

      expect(hasOutThresholdAttr).toBeFalsy();
    });

    test("dragged doesn't have out-container attr because it's inside the container", async () => {
      const hasOutContainerAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-container"),
      );

      expect(hasOutContainerAttr).toBeFalsy();
    });
  });

  test.describe("release in the new position", async () => {
    test.beforeAll(async () => {
      await page.dispatchEvent("#mtg", "mouseup", {
        button: 0,
        force: true,
      });
    });

    test("dragged element has dragged attr", async () => {
      const hasDraggedAttr = await elm1.evaluate((el) =>
        el.hasAttribute("dragged"),
      );

      expect(hasDraggedAttr).toBeFalsy();
    });

    test("dragged has out-threshold attr when it's out threshold", async () => {
      const hasOutThresholdAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-threshold"),
      );

      expect(hasOutThresholdAttr).toBeFalsy();
    });

    test("dragged doesn't have out-container attr because it's inside the container", async () => {
      const hasOutContainerAttr = await elm1.evaluate((el) =>
        el.hasAttribute("data-out-container"),
      );

      expect(hasOutContainerAttr).toBeFalsy();
    });
  });
});
