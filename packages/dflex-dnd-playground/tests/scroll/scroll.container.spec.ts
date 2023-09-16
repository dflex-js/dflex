import {
  // Locator,
  BrowserContext,
  Locator,
  Page,
  expect,
} from "@playwright/test";

import { DFlexPageTest as test } from "../utils";

test.describe.parallel("Resolve scroll container correctly", async () => {
  let context: BrowserContext;

  let page1: Page;
  let page2: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();

    // Open the first page.
    page1 = await context.newPage();
    await page1.goto("/extended");

    // Open the second page.
    page2 = await context.newPage();
    await page2.goto("/scroll");
  });

  test.afterAll(async () => {
    await context.close();

    // Close both pages.
    await page1.close();
    await page2.close();
  });

  test("Identify document as scroll container", async ({ browserName }) => {
    const hasDataScroll = await page1.evaluate(
      () => document.body.getAttribute("data-scroll__dflex_sk_0_0") === "true",
    );

    expect(hasDataScroll).toBe(true);

    if (browserName === "webkit") {
      await page1.waitForTimeout(2000);
    }
  });

  test("Identify div(s) scroll container", async ({ browserName }) => {
    const [u1, u2, u3] = (await Promise.all([
      page2.locator("#dflex_id_0"),
      page2.locator("#dflex_id_1"),
      page2.locator("#dflex_id_2"),
    ])) as Locator[];

    if (browserName === "webkit") {
      await page1.waitForTimeout(2000);
    }

    const [dataScroll1, dataScroll2, dataScroll3] = await Promise.all([
      u1.getAttribute("data-scroll__dflex_sk_0_0"),
      u2.getAttribute("data-scroll__dflex_sk_0_1"),
      u3.getAttribute("data-scroll__dflex_sk_0_2"),
    ]);

    if (browserName === "webkit") {
      await page1.waitForTimeout(2000);
    }

    expect(dataScroll1).toBe("true");
    expect(dataScroll2).toBe("true");
    expect(dataScroll3).toBe("true");
  });
});
