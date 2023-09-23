/* eslint-disable no-underscore-dangle */
import { Page, BrowserContext, Browser, expect } from "@playwright/test";

import { DFlexPageTest as test, DOMGenKeysType } from "dflex-e2e-utils";

test.describe("Stress testing generated keys with client side rendering", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let DOMGenKeys: DOMGenKeysType;

  let idsBySk = {};

  let SKByDepth = {};

  let branchesRegistry = {};

  test.beforeAll(async ({ browser, baseURL }) => {
    activeBrowser = browser;
    context = await activeBrowser.newContext();
    page = await context.newPage();
    await page.goto(baseURL!);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    // await activeBrowser.close();
  });

  async function clickAndNavigate(
    elementType: "symmetric" | "asymmetric" | "transformation",
    goBack: boolean,
  ) {
    switch (elementType) {
      case "symmetric":
        await page.click('a[href="/list/symmetric"]');
        await page.waitForSelector("ul#symmetric-container-list");
        break;

      case "asymmetric":
        await page.click('a[href="/list/asymmetric"]');
        await page.waitForSelector("ul#asymmetric-container-list");
        break;

      case "transformation":
        await page.click('a[href="/list/transformation"]');
        await page.waitForSelector("ul#trans-container-list");
        break;

      default:
        throw new Error(`Invalid element type: ${elementType}`);
    }

    if (!goBack) {
      return;
    }

    // Go back to the main page
    await page.goBack();

    // Wait for clean up to be done internally.
    await page.waitForTimeout(500);

    // Wait for the main page content to be visible
    await page.waitForSelector("div#main-page-content");
  }

  const clickAndNavigateSymmetric = ({ goBack = true } = {}) =>
    clickAndNavigate("symmetric", goBack);
  const clickAndNavigateAsymmetric = ({ goBack = true } = {}) =>
    clickAndNavigate("asymmetric", goBack);
  const clickAndNavigateTransformation = ({ goBack = true } = {}) =>
    clickAndNavigate("transformation", goBack);

  async function runTest(i: number, fn: () => Promise<void>) {
    if (i > 0) {
      await fn();

      // Call the function recursively with the updated index
      await runTest(i - 1, fn);
    }
  }

  async function retrieveDOMGenPrivateKeys() {
    await page.waitForFunction(() => {
      return window.$DFlex && window.$DFlex.DOMGen._DEV_getPrivateKeys;
    });

    const handle = await page.evaluateHandle(() => {
      return window.$DFlex.DOMGen._DEV_getPrivateKeys()!;
    });

    DOMGenKeys = await handle.jsonValue();

    console.dir(DOMGenKeys, { depth: null });
  }

  function assertDOMGenKeys() {
    expect(DOMGenKeys.idsBySk).toStrictEqual(idsBySk);
    expect(DOMGenKeys.SKByDepth).toStrictEqual(SKByDepth);
    expect(DOMGenKeys.branchesRegistry).toStrictEqual(branchesRegistry);
  }

  test("Navigation and interaction to generate keys (Symmetric)", async () => {
    await runTest(11, clickAndNavigateSymmetric);
  });

  test("Should correctly retrieve empty keys after Symmetric is done", async () => {
    await retrieveDOMGenPrivateKeys();
    assertDOMGenKeys();
  });

  test("Navigation and interaction to generate keys (Asymmetric)", async () => {
    await runTest(11, clickAndNavigateAsymmetric);
  });

  test("Should correctly retrieve empty keys after Asymmetric is done", async () => {
    await retrieveDOMGenPrivateKeys();
    assertDOMGenKeys();
  });

  test("Navigation and interaction to generate keys (Transformation)", async () => {
    await runTest(11, clickAndNavigateTransformation);
  });

  test("Should correctly retrieve empty keys after Transformation is done", async () => {
    await retrieveDOMGenPrivateKeys();
    assertDOMGenKeys();
  });

  test("Navigation and interaction to generate keys (Symmetric) again", async () => {
    await clickAndNavigateSymmetric({ goBack: false });
  });

  test("Should correctly retrieve correct keys after Symmetric is done", async () => {
    await retrieveDOMGenPrivateKeys();

    // Update the expected keys.
    idsBySk = {
      dflex_sk_0_33: ["sym-mtg", "clean", "sym-shop", "sym-gym"],
      dflex_sk_1_0: ["symmetric-container-list"],
    };
    SKByDepth = {
      "0": ["dflex_sk_0_33"],
      "1": ["dflex_sk_1_0"],
    };
    branchesRegistry = {
      dflex_bk_33: {
        "0": {
          ids: ["sym-mtg", "clean", "sym-shop", "sym-gym"],
          SK: "dflex_sk_0_33",
        },
        "1": { ids: ["symmetric-container-list"], SK: "dflex_sk_1_0" },
      },
    };

    assertDOMGenKeys();
  });
});
