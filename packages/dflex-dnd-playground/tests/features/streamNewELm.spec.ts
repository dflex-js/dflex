import {
  test,
  expect,
  Page,
  Locator,
  BrowserContext,
  Browser,
} from "@playwright/test";

import {
  assertChildrenOrderIDs,
  getDraggedRect,
  initialize,
  moveDragged,
} from "../utils";

test.describe.skip(
  "Stream new element then transform mutate and check the new positions",
  async () => {
    let page: Page;
    let context: BrowserContext;
    let activeBrowser: Browser;

    let elmAParent: Locator;
    let elmBParent: Locator;

    test.beforeAll(async ({ browser, browserName }) => {
      activeBrowser = browser;

      context = await activeBrowser.newContext();
      page = await context.newPage();
      initialize(page, browserName, 50);
      await page.goto("/stream-new");

      [elmAParent, elmBParent] = await Promise.all([
        page.locator("#dflex_id_0"),
        page.locator("#dflex_id_1"),
      ]);
    });

    test.afterAll(async () => {
      await page.close();
      await context.close();
      // await activeBrowser.close();
    });

    test.describe("First round 5 elements", () => {
      let elmA00: Locator;
      let elmA01: Locator;
      let elmA02: Locator;
      let elmA03: Locator;
      let elmA04: Locator;

      let elmB00: Locator;
      let elmB01: Locator;
      let elmB02: Locator;
      let elmB03: Locator;
      let elmB04: Locator;

      test.beforeAll(async () => {
        await page.keyboard.press("r", { delay: 50 });

        [
          elmA00,
          elmA01,
          elmA02,
          elmA03,
          elmA04,

          elmB00,
          elmB01,
          elmB02,
          elmB03,
          elmB04,
        ] = await Promise.all([
          page.locator("#a-0-0"),
          page.locator("#a-0-1"),
          page.locator("#a-0-2"),
          page.locator("#a-0-3"),
          page.locator("#a-0-4"),

          page.locator("#b-0-0"),
          page.locator("#b-0-1"),
          page.locator("#b-0-2"),
          page.locator("#b-0-3"),
          page.locator("#b-0-4"),
        ]);
      });

      async function moveElmDown(elm: Locator, id: string) {
        await getDraggedRect(elm);
        await moveDragged(-1, 340);
        await page.dispatchEvent(id, "mouseup", {
          button: 0,
          force: true,
        });
      }

      test("Siblings indexed correctly", async () => {
        (
          await Promise.all([
            elmB00.getAttribute("data-index"),
            elmB01.getAttribute("data-index"),
            elmB02.getAttribute("data-index"),
            elmB03.getAttribute("data-index"),
            elmB04.getAttribute("data-index"),
          ])
        ).forEach((_, i) => {
          expect(_).toBe(`${i}`);
        });

        (
          await Promise.all([
            elmA00.getAttribute("data-index"),
            elmA01.getAttribute("data-index"),
            elmA02.getAttribute("data-index"),
            elmA03.getAttribute("data-index"),
            elmA04.getAttribute("data-index"),
          ])
        ).forEach((_, i) => {
          expect(_).toBe(`${i}`);
        });
      });

      test("Transforms elements (#a-0-0) and (#b-0-0) - to the end", async () => {
        await moveElmDown(elmA00, "#a-0-0");
        await moveElmDown(elmB00, "#b-0-0");
      });

      test("Siblings positioned correctly", async () => {
        (
          await Promise.all([
            elmB01.getAttribute("data-index"),
            elmB02.getAttribute("data-index"),
            elmB03.getAttribute("data-index"),
            elmB04.getAttribute("data-index"),
          ])
        ).forEach((_, i) => {
          expect(_).toBe(`${i}`);
        });

        (
          await Promise.all([
            elmA01.getAttribute("data-index"),
            elmA02.getAttribute("data-index"),
            elmA03.getAttribute("data-index"),
            elmA04.getAttribute("data-index"),
          ])
        ).forEach((_, i) => {
          expect(_).toBe(`${i}`);
        });

        (
          await Promise.all([
            elmA00.getAttribute("data-index"),
            elmB00.getAttribute("data-index"),
          ])
        ).forEach((_) => {
          expect(_).toBe("4");
        });
      });

      test("Siblings have the correct order in DOM", async () => {
        await Promise.all([
          assertChildrenOrderIDs(elmAParent, [
            "a-0-1",
            "a-0-2",
            "a-0-3",
            "a-0-4",
            "a-0-0",
          ]),
          assertChildrenOrderIDs(elmBParent, [
            "b-0-1",
            "b-0-2",
            "b-0-3",
            "b-0-4",
            "b-0-0",
          ]),
        ]);
      });
    });

    test.describe("Second round 10 elements", () => {
      let elmA10: Locator;
      let elmA11: Locator;
      let elmA12: Locator;
      let elmA13: Locator;
      let elmA14: Locator;
      let elmA15: Locator;
      let elmA16: Locator;
      let elmA17: Locator;
      let elmA18: Locator;
      let elmA19: Locator;

      let elmB10: Locator;
      let elmB11: Locator;
      let elmB12: Locator;
      let elmB13: Locator;
      let elmB14: Locator;
      let elmB15: Locator;
      let elmB16: Locator;
      let elmB17: Locator;
      let elmB18: Locator;
      let elmB19: Locator;

      test.beforeAll(async () => {
        await page.keyboard.press("r", { delay: 50 });

        [
          elmA10,
          elmA11,
          elmA12,
          elmA13,
          elmA14,
          elmA15,
          elmA16,
          elmA17,
          elmA18,
          elmA19,

          elmB10,
          elmB11,
          elmB12,
          elmB13,
          elmB14,
          elmB15,
          elmB16,
          elmB17,
          elmB18,
          elmB19,
        ] = await Promise.all([
          page.locator("#a-1-0"),
          page.locator("#a-1-1"),
          page.locator("#a-1-2"),
          page.locator("#a-1-3"),
          page.locator("#a-1-4"),
          page.locator("#a-1-5"),
          page.locator("#a-1-6"),
          page.locator("#a-1-7"),
          page.locator("#a-1-8"),
          page.locator("#a-1-9"),

          page.locator("#b-1-0"),
          page.locator("#b-1-1"),
          page.locator("#b-1-2"),
          page.locator("#b-1-3"),
          page.locator("#b-1-4"),
          page.locator("#b-1-5"),
          page.locator("#b-1-6"),
          page.locator("#b-1-7"),
          page.locator("#b-1-8"),
          page.locator("#b-1-9"),
        ]);
      });

      test("Siblings indexed correctly", async () => {
        await getDraggedRect(elmB10);
        await page.dispatchEvent("#b-1-0", "mouseup", {
          button: 0,
          force: true,
        });

        (
          await Promise.all([
            elmB10.getAttribute("data-index"),
            elmB11.getAttribute("data-index"),
            elmB12.getAttribute("data-index"),
            elmB13.getAttribute("data-index"),
            elmB14.getAttribute("data-index"),
            elmB15.getAttribute("data-index"),
            elmB16.getAttribute("data-index"),
            elmB17.getAttribute("data-index"),
            elmB18.getAttribute("data-index"),
            elmB19.getAttribute("data-index"),
          ])
        ).forEach((_, i) => {
          expect(_).toBe(`${i}`);
        });

        (
          await Promise.all([
            elmA10.getAttribute("data-index"),
            elmA11.getAttribute("data-index"),
            elmA12.getAttribute("data-index"),
            elmA13.getAttribute("data-index"),
            elmA14.getAttribute("data-index"),
            elmA15.getAttribute("data-index"),
            elmA16.getAttribute("data-index"),
            elmA17.getAttribute("data-index"),
            elmA18.getAttribute("data-index"),
            elmA19.getAttribute("data-index"),
          ])
        ).forEach((_, i) => {
          expect(_).toBe(`${i}`);
        });
      });
    });

    test.describe.skip("First round 20 elements", () => {
      let elmA30: Locator;
      let elmA31: Locator;
      let elmA32: Locator;
      let elmA33: Locator;
      let elmA34: Locator;
      let elmA35: Locator;
      let elmA36: Locator;
      let elmA37: Locator;
      let elmA38: Locator;
      let elmA39: Locator;
      let elmA310: Locator;
      let elmA311: Locator;
      let elmA312: Locator;
      let elmA313: Locator;
      let elmA314: Locator;
      let elmA315: Locator;
      let elmA316: Locator;
      let elmA317: Locator;
      let elmA318: Locator;
      let elmA319: Locator;

      let elmB30: Locator;
      let elmB31: Locator;
      let elmB32: Locator;
      let elmB33: Locator;
      let elmB34: Locator;
      let elmB35: Locator;
      let elmB36: Locator;
      let elmB37: Locator;
      let elmB38: Locator;
      let elmB39: Locator;
      let elmB310: Locator;
      let elmB311: Locator;
      let elmB312: Locator;
      let elmB313: Locator;
      let elmB314: Locator;
      let elmB315: Locator;
      let elmB316: Locator;
      let elmB317: Locator;
      let elmB318: Locator;
      let elmB319: Locator;

      async function moveElmDown(elm: Locator, id: string) {
        await getDraggedRect(elm);
        await moveDragged(-1, 800);
        await moveDragged(-1, 200);
        await page.dispatchEvent(id, "mouseup", {
          button: 0,
          force: true,
        });
      }

      test.beforeAll(async () => {
        // Trigger new children three times reaches to the last round.
        await page.keyboard.press("r", { delay: 50 });
        await page.keyboard.press("r", { delay: 50 });
        await page.keyboard.press("r", { delay: 50 });

        [
          elmA30,
          elmA31,
          elmA32,
          elmA33,
          elmA34,
          elmA35,
          elmA36,
          elmA37,
          elmA38,
          elmA39,
          elmA310,
          elmA311,
          elmA312,
          elmA313,
          elmA314,
          elmA315,
          elmA316,
          elmA317,
          elmA318,
          elmA319,

          elmB30,
          elmB31,
          elmB32,
          elmB33,
          elmB34,
          elmB35,
          elmB36,
          elmB37,
          elmB38,
          elmB39,
          elmB310,
          elmB311,
          elmB312,
          elmB313,
          elmB314,
          elmB315,
          elmB316,
          elmB317,
          elmB318,
          elmB319,
        ] = await Promise.all([
          page.locator("#a-3-0"),
          page.locator("#a-3-1"),
          page.locator("#a-3-2"),
          page.locator("#a-3-3"),
          page.locator("#a-3-4"),
          page.locator("#a-3-5"),
          page.locator("#a-3-6"),
          page.locator("#a-3-7"),
          page.locator("#a-3-8"),
          page.locator("#a-3-9"),
          page.locator("#a-3-10"),
          page.locator("#a-3-11"),
          page.locator("#a-3-12"),
          page.locator("#a-3-13"),
          page.locator("#a-3-14"),
          page.locator("#a-3-15"),
          page.locator("#a-3-16"),
          page.locator("#a-3-17"),
          page.locator("#a-3-18"),
          page.locator("#a-3-19"),

          page.locator("#b-3-0"),
          page.locator("#b-3-1"),
          page.locator("#b-3-2"),
          page.locator("#b-3-3"),
          page.locator("#b-3-4"),
          page.locator("#b-3-5"),
          page.locator("#b-3-6"),
          page.locator("#b-3-7"),
          page.locator("#b-3-8"),
          page.locator("#b-3-9"),
          page.locator("#b-3-10"),
          page.locator("#b-3-11"),
          page.locator("#b-3-12"),
          page.locator("#b-3-13"),
          page.locator("#b-3-14"),
          page.locator("#b-3-15"),
          page.locator("#b-3-16"),
          page.locator("#b-3-17"),
          page.locator("#b-3-18"),
          page.locator("#b-3-19"),
        ]);
      });

      test("Siblings indexed correctly", async () => {
        (
          await Promise.all([
            elmA30.getAttribute("data-index"),
            elmA31.getAttribute("data-index"),
            elmA32.getAttribute("data-index"),
            elmA33.getAttribute("data-index"),
            elmA34.getAttribute("data-index"),
            elmA35.getAttribute("data-index"),
            elmA36.getAttribute("data-index"),
            elmA37.getAttribute("data-index"),
            elmA38.getAttribute("data-index"),
            elmA39.getAttribute("data-index"),
            elmA310.getAttribute("data-index"),
            elmA311.getAttribute("data-index"),
            elmA312.getAttribute("data-index"),
            elmA313.getAttribute("data-index"),
            elmA314.getAttribute("data-index"),
            elmA315.getAttribute("data-index"),
            elmA316.getAttribute("data-index"),
            elmA317.getAttribute("data-index"),
            elmA318.getAttribute("data-index"),
            elmA319.getAttribute("data-index"),
          ])
        ).forEach((_, i) => {
          expect(_).toBe(`${i}`);
        });

        (
          await Promise.all([
            elmB30.getAttribute("data-index"),
            elmB31.getAttribute("data-index"),
            elmB32.getAttribute("data-index"),
            elmB33.getAttribute("data-index"),
            elmB34.getAttribute("data-index"),
            elmB35.getAttribute("data-index"),
            elmB36.getAttribute("data-index"),
            elmB37.getAttribute("data-index"),
            elmB38.getAttribute("data-index"),
            elmB39.getAttribute("data-index"),
            elmB310.getAttribute("data-index"),
            elmB311.getAttribute("data-index"),
            elmB312.getAttribute("data-index"),
            elmB313.getAttribute("data-index"),
            elmB314.getAttribute("data-index"),
            elmB315.getAttribute("data-index"),
            elmB316.getAttribute("data-index"),
            elmB317.getAttribute("data-index"),
            elmB318.getAttribute("data-index"),
            elmB319.getAttribute("data-index"),
          ])
        ).forEach((_, i) => {
          expect(_).toBe(`${i}`);
        });
      });

      // test("Transforms elements (#a-3-0) and (#b-3-0) - to the end", async () => {
      //   [
      //     elmA30,
      //     elmA31,
      //     elmA32,
      //     elmA33,
      //     elmA34,
      //     elmA35,
      //     elmA36,
      //     elmA37,
      //     elmA38,
      //     elmA39,
      //     elmA310,
      //     elmA311,
      //     elmA312,
      //     elmA313,
      //     elmA314,
      //     elmA315,
      //     elmA316,
      //     elmA317,
      //     elmA318,
      //     elmA319,

      //     elmB30,
      //     elmB31,
      //     elmB32,
      //     elmB33,
      //     elmB34,
      //     elmB35,
      //     elmB36,
      //     elmB37,
      //     elmB38,
      //     elmB39,
      //     elmB310,
      //     elmB311,
      //     elmB312,
      //     elmB313,
      //     elmB314,
      //     elmB315,
      //     elmB316,
      //     elmB317,
      //     elmB318,
      //     elmB319,
      //   ] = await Promise.all([
      //     page.locator("#a-3-0"),
      //     page.locator("#a-3-1"),
      //     page.locator("#a-3-2"),
      //     page.locator("#a-3-3"),
      //     page.locator("#a-3-4"),
      //     page.locator("#a-3-5"),
      //     page.locator("#a-3-6"),
      //     page.locator("#a-3-7"),
      //     page.locator("#a-3-8"),
      //     page.locator("#a-3-9"),
      //     page.locator("#a-3-10"),
      //     page.locator("#a-3-11"),
      //     page.locator("#a-3-12"),
      //     page.locator("#a-3-13"),
      //     page.locator("#a-3-14"),
      //     page.locator("#a-3-15"),
      //     page.locator("#a-3-16"),
      //     page.locator("#a-3-17"),
      //     page.locator("#a-3-18"),
      //     page.locator("#a-3-19"),

      //     page.locator("#b-3-0"),
      //     page.locator("#b-3-1"),
      //     page.locator("#b-3-2"),
      //     page.locator("#b-3-3"),
      //     page.locator("#b-3-4"),
      //     page.locator("#b-3-5"),
      //     page.locator("#b-3-6"),
      //     page.locator("#b-3-7"),
      //     page.locator("#b-3-8"),
      //     page.locator("#b-3-9"),
      //     page.locator("#b-3-10"),
      //     page.locator("#b-3-11"),
      //     page.locator("#b-3-12"),
      //     page.locator("#b-3-13"),
      //     page.locator("#b-3-14"),
      //     page.locator("#b-3-15"),
      //     page.locator("#b-3-16"),
      //     page.locator("#b-3-17"),
      //     page.locator("#b-3-18"),
      //     page.locator("#b-3-19"),
      //   ]);

      //   await moveElmDown(elmA30, "#a-3-0");
      //   await moveElmDown(elmB30, "#b-b-0");
      // });

      // test("Siblings positioned correctly", async () => {
      //   await Promise.all([
      //     expect(elmA30).toHaveCSS("transform", "none"),
      //     expect(elmA31).toHaveCSS("transform", "none"),
      //     expect(elmA32).toHaveCSS("transform", "none"),
      //     expect(elmA33).toHaveCSS("transform", "none"),
      //     expect(elmA34).toHaveCSS("transform", "none"),
      //     expect(elmA35).toHaveCSS("transform", "none"),
      //     expect(elmA36).toHaveCSS("transform", "none"),
      //     expect(elmA37).toHaveCSS("transform", "none"),
      //     expect(elmA38).toHaveCSS("transform", "none"),
      //     expect(elmA39).toHaveCSS("transform", "none"),
      //     expect(elmA310).toHaveCSS("transform", "none"),
      //     expect(elmA311).toHaveCSS("transform", "none"),
      //     expect(elmA312).toHaveCSS("transform", "none"),
      //     expect(elmA313).toHaveCSS("transform", "none"),
      //     expect(elmA314).toHaveCSS("transform", "none"),
      //     expect(elmA315).toHaveCSS("transform", "none"),
      //     expect(elmA316).toHaveCSS("transform", "none"),
      //     expect(elmA317).toHaveCSS("transform", "none"),
      //     expect(elmA318).toHaveCSS("transform", "none"),
      //     expect(elmA319).toHaveCSS("transform", "none"),

      //     expect(elmB30).toHaveCSS("transform", "none"),
      //     expect(elmB31).toHaveCSS("transform", "none"),
      //     expect(elmB32).toHaveCSS("transform", "none"),
      //     expect(elmB33).toHaveCSS("transform", "none"),
      //     expect(elmB34).toHaveCSS("transform", "none"),
      //     expect(elmB35).toHaveCSS("transform", "none"),
      //     expect(elmB36).toHaveCSS("transform", "none"),
      //     expect(elmB37).toHaveCSS("transform", "none"),
      //     expect(elmB38).toHaveCSS("transform", "none"),
      //     expect(elmB39).toHaveCSS("transform", "none"),
      //     expect(elmB310).toHaveCSS("transform", "none"),
      //     expect(elmB311).toHaveCSS("transform", "none"),
      //     expect(elmB312).toHaveCSS("transform", "none"),
      //     expect(elmB313).toHaveCSS("transform", "none"),
      //     expect(elmB314).toHaveCSS("transform", "none"),
      //     expect(elmB315).toHaveCSS("transform", "none"),
      //     expect(elmB316).toHaveCSS("transform", "none"),
      //     expect(elmB317).toHaveCSS("transform", "none"),
      //     expect(elmB318).toHaveCSS("transform", "none"),
      //     expect(elmB319).toHaveCSS("transform", "none"),
      //   ]);

      // (
      //   await Promise.all([
      //     elmB01.getAttribute("data-index"),
      //     elmB02.getAttribute("data-index"),
      //     elmB03.getAttribute("data-index"),
      //     elmB04.getAttribute("data-index"),
      //   ])
      // ).forEach((_, i) => {
      //   expect(_).toBe(`${i}`);
      // });

      // (
      //   await Promise.all([
      //     elmA01.getAttribute("data-index"),
      //     elmA02.getAttribute("data-index"),
      //     elmA03.getAttribute("data-index"),
      //     elmA04.getAttribute("data-index"),
      //   ])
      // ).forEach((_, i) => {
      //   expect(_).toBe(`${i}`);
      // });

      // (
      //   await Promise.all([
      //     elmA00.getAttribute("data-index"),
      //     elmB00.getAttribute("data-index"),
      //   ])
      // ).forEach((_) => {
      //   expect(_).toBe("4");
      // });
      // });
    });
  }
);
