/* eslint-disable no-underscore-dangle */
import { BrowserContext, Page, expect } from "@playwright/test";

import { DFlexPageTest as test } from "../utils";

const { PACKAGE_BUNDLE } = process.env;

const isProdBundle = PACKAGE_BUNDLE === "production";

const SKIP_REASON = "This assertion works with development bundle only";

test.describe
  .parallel("Testing DFlex generated keys by accessing window for grid page", async () => {
  test.skip(isProdBundle, SKIP_REASON);

  let context: BrowserContext;

  let page: Page;

  let DOMGenKeys;

  const idsBySk = {
    // depth-1
    dflex_sk_1_0: ["id-p2"],

    // depth-0
    dflex_sk_0_0: ["id-2", "id-3", "id-4", "id-5", "id-6", "id-7", "id-8"],
  };

  const SKByDepth = { "0": ["dflex_sk_0_0"], "1": ["dflex_sk_1_0"] };

  const branchesRegistry = {
    dflex_bk_0: {
      "0": {
        ids: ["id-2", "id-3", "id-4", "id-5", "id-6", "id-7", "id-8"],
        SK: "dflex_sk_0_0",
      },
      "1": { ids: ["id-p2"], SK: "dflex_sk_1_0" },
    },
  };

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("/grid");
    const handle = await page.evaluateHandle(() => {
      return window.$DFlex.DOMGen._DEV_getPrivateKeys();
    });

    DOMGenKeys = await handle.jsonValue();
  });

  test.afterAll(async () => {
    await context.close();
    await page.close();
  });

  test("Should correctly retrieve idsBySk", async () => {
    expect(DOMGenKeys?.idsBySk).toStrictEqual(idsBySk);
  });

  test("Should correctly retrieve SKByDepth", async () => {
    expect(DOMGenKeys?.SKByDepth).toStrictEqual(SKByDepth);
  });

  test("Should correctly retrieve branchesRegistry", async () => {
    expect(DOMGenKeys?.branchesRegistry).toStrictEqual(branchesRegistry);
  });
});
