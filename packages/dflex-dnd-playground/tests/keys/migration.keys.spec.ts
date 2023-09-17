/* eslint-disable no-underscore-dangle */
import { BrowserContext, Page, expect } from "@playwright/test";

import { DFlexPageTest as test } from "../utils";
import { DOMGenKeysType } from "./sharedTypes";

const { PACKAGE_BUNDLE } = process.env;

const isProdBundle = PACKAGE_BUNDLE === "production";

const SKIP_REASON = "This assertion works with development bundle only";

test.describe
  .parallel("Testing DFlex generated keys by accessing window for migration page", async () => {
  test.skip(isProdBundle, SKIP_REASON);

  let context: BrowserContext;

  let page: Page;

  let DOMGenKeys: DOMGenKeysType;

  const idsBySk = {
    // depth-2
    dflex_sk_2_0: ["dflex_id_0"],

    // depth-1
    dflex_sk_1_0: ["id-p1", "id-p2", "id-p3"],

    // depth-0
    dflex_sk_0_0: ["c1-1"],
    dflex_sk_0_1: ["c2-1", "c2-2", "c2-3", "c2-4", "c2-5"],
    dflex_sk_0_2: ["c3-1", "c3-2"],
  };

  const SKByDepth = {
    "0": ["dflex_sk_0_0", "dflex_sk_0_1", "dflex_sk_0_2"],
    "1": ["dflex_sk_1_0"],
    "2": ["dflex_sk_2_0"],
  };

  const branchesRegistry = {
    dflex_bk_0: {
      "0": { ids: ["c1-1"], SK: "dflex_sk_0_0" },
      "1": { ids: ["id-p1"], SK: "dflex_sk_1_0" },
      "2": { ids: ["dflex_id_0"], SK: "dflex_sk_2_0" },
    },
    dflex_bk_1: {
      "0": {
        ids: ["c2-1", "c2-2", "c2-3", "c2-4", "c2-5"],
        SK: "dflex_sk_0_1",
      },
      "1": { ids: ["id-p2"], SK: "dflex_sk_1_0" },
      "2": { ids: ["dflex_id_0"], SK: "dflex_sk_2_0" },
    },
    dflex_bk_2: {
      "0": { ids: ["c3-1", "c3-2"], SK: "dflex_sk_0_2" },
      "1": { ids: ["id-p3"], SK: "dflex_sk_1_0" },
      "2": { ids: ["dflex_id_0"], SK: "dflex_sk_2_0" },
    },
  };

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("/migration");
    const handle = await page.evaluateHandle(() => {
      return window.$DFlex.DOMGen._DEV_getPrivateKeys()!;
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
