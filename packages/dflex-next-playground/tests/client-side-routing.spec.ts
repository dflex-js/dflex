import test from "@playwright/test";

test.describe("Stream incremental element then transform mutate and check the new positions", async () => {
  //   let page: Page;
  //   let context: BrowserContext;
  //   let activeBrowser: Browser;
  //   let elmAParent: Locator;
  //   let elmBParent: Locator;
  //   let elmA00: Locator;
  //   let elmB00: Locator;
  //   test.beforeAll(async ({ browser, browserName }) => {
  //     activeBrowser = browser;
  //     context = await activeBrowser.newContext();
  //     page = await context.newPage();
  //     initialize(page, browserName, 50);
  //     await page.goto("/stream-inc");
  //     [elmAParent, elmA00, elmBParent, elmB00] = await Promise.all([
  //       page.locator("#dflex_id_0"),
  //       page.locator("#a-0"),
  //       page.locator("#dflex_id_1"),
  //       page.locator("#b-0"),
  //     ]);
  //   });
  //   test.afterAll(async () => {
  //     await page.close();
  //     await context.close();
  //     // await activeBrowser.close();
  //   });
  //   test("Visit main page, navigate, and check", async ({ page }) => {
  //     // Visit the main page
  //     await page.goto("https://example.com");
  //     // Click a link to navigate to /list/asymmetric
  //     await page.click('a[href="/list/asymmetric"]');
  //     // Wait for the new page to load (replace 'selector-on-new-page' with your actual selector)
  //     await page.waitForSelector("selector-on-new-page");
  //     // Perform your checks on the new page
  //     const textContent = await page.textContent("selector-on-new-page");
  //     // Example check: Make sure the text contains "Expected Text"
  //     expect(textContent).toContain("Expected Text");
  //   });
});
