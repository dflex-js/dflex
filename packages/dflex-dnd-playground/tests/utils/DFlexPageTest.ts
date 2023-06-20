import { test as base, expect } from "@playwright/test";

export const DFlexPageTest = base.extend({
  page: async ({ page }, use) => {
    const messages: string[] = [];

    // Listen for console errors.
    page.on("console", (msg) => {
      // Ignore regular log messages; we are only interested in errors.
      if (msg.type() === "error") {
        messages.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    // Listen for page errors.
    // Uncaught (in promise) TypeError + friends are page errors.
    page.on("pageerror", (error) => {
      messages.push(`[${error.name}] ${error.message}`);
    });

    await use(page);

    // Fail the test if there are any console errors.
    expect(messages).toStrictEqual([]);
  },
});

DFlexPageTest.setTimeout(30000);

export default DFlexPageTest;
