/* eslint-disable no-underscore-dangle */
import { BrowserContext, Page, expect } from "@playwright/test";

import {
  DEVELOPMENT_ONLY_ASSERTION,
  isProdBundle,
  DFlexPageTest as test,
} from "../utils";
import { DOMGenKeysType } from "../utils/sharedTypes";

test.describe
  .parallel("Testing DFlex generated keys by accessing window for landing page", async () => {
  test.skip(isProdBundle, DEVELOPMENT_ONLY_ASSERTION);

  let context: BrowserContext;

  let page: Page;

  let DOMGenKeys: DOMGenKeysType;

  const idsBySk = {
    // depth-2
    dflex_sk_2_0: ["dflex_id_0"],

    // depth-1
    dflex_sk_1_0: ["id-p1", "id-p2", "id-p3"],

    // depth-0
    dflex_sk_0_0: ["id-1"],
    dflex_sk_0_1: ["id-2", "id-3", "id-4", "id-5", "id-6", "id-7", "id-8"],
    dflex_sk_0_2: ["id-9", "id-10", "id-11", "id-12"],
  };

  const SKByDepth = {
    "0": ["dflex_sk_0_0", "dflex_sk_0_1", "dflex_sk_0_2"],
    "1": ["dflex_sk_1_0"],
    "2": ["dflex_sk_2_0"],
  };

  const branchesRegistry = {
    dflex_bk_0: {
      "0": { ids: ["id-1"], SK: "dflex_sk_0_0" },
      "1": { ids: ["id-p1"], SK: "dflex_sk_1_0" },
      "2": { ids: ["dflex_id_0"], SK: "dflex_sk_2_0" },
    },
    dflex_bk_1: {
      "0": {
        ids: ["id-2", "id-3", "id-4", "id-5", "id-6", "id-7", "id-8"],
        SK: "dflex_sk_0_1",
      },
      "1": { ids: ["id-p2"], SK: "dflex_sk_1_0" },
      "2": { ids: ["dflex_id_0"], SK: "dflex_sk_2_0" },
    },
    dflex_bk_2: {
      "0": { ids: ["id-9", "id-10", "id-11", "id-12"], SK: "dflex_sk_0_2" },
      "1": { ids: ["id-p3"], SK: "dflex_sk_1_0" },
      "2": { ids: ["dflex_id_0"], SK: "dflex_sk_2_0" },
    },
  };

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("/");
    await page.waitForFunction(() => {
      return window.$DFlex && window.$DFlex.DOMGen._DEV_getPrivateKeys;
    });
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
    expect(DOMGenKeys.idsBySk).toStrictEqual(idsBySk);
  });

  test("Should correctly retrieve SKByDepth", async () => {
    expect(DOMGenKeys.SKByDepth).toStrictEqual(SKByDepth);
  });

  test("Should correctly retrieve branchesRegistry", async () => {
    expect(DOMGenKeys.branchesRegistry).toStrictEqual(branchesRegistry);
  });
});
