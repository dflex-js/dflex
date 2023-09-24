/* eslint-disable no-underscore-dangle */
import { Page, BrowserContext, Browser, expect } from "@playwright/test";

import {
  DFlexPageTest as test,
  DOMGenKeysType,
  StorE2EType,
} from "dflex-e2e-utils";

test.describe("Stress testing generated keys with client side rendering", async () => {
  let page: Page;
  let context: BrowserContext;
  let activeBrowser: Browser;

  let DOMGenKeys: DOMGenKeysType;
  let store: StorE2EType;

  let idsBySk = {};
  let SKByDepth = {};
  let branchesRegistry = {};

  const containers = {};
  const mutationObserverMap = {};
  const scrolls = {};

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
  }

  async function returnToMainPageAndWait() {
    // Go back to the main page
    await page.goBack();

    // Wait for clean up to be done internally.
    await page.waitForTimeout(500);

    // Wait for the main page content to be visible
    await page.waitForSelector("div#main-page-content");
  }

  const clickAndNavigateSymmetric = () => clickAndNavigate("symmetric");
  const clickAndNavigateAsymmetric = () => clickAndNavigate("asymmetric");
  const clickAndNavigateTransformation = () =>
    clickAndNavigate("transformation");

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

    await page.waitForFunction(() => {
      return window.$DFlex && window.$DFlex._DEV_getStoreAttachments;
    });

    const [handleKeys, handleStore] = await Promise.all([
      page.evaluateHandle(() => window.$DFlex.DOMGen._DEV_getPrivateKeys()!),
      page.evaluateHandle(() => window.$DFlex._DEV_getStoreAttachments()!),
    ]);

    [DOMGenKeys, store] = await Promise.all([
      handleKeys.jsonValue(),
      handleStore.jsonValue(),
    ]);
  }

  function assertDOMGenKeys() {
    expect(DOMGenKeys.idsBySk).toStrictEqual(idsBySk);
    expect(DOMGenKeys.SKByDepth).toStrictEqual(SKByDepth);
    expect(DOMGenKeys.branchesRegistry).toStrictEqual(branchesRegistry);
  }

  function assertAttachments() {
    expect(store.containers).toStrictEqual(containers);
    expect(store.mutationObserverMap).toStrictEqual(mutationObserverMap);
    expect(store.scrolls).toStrictEqual(scrolls);
  }

  test("Navigation and interaction to generate keys (Symmetric)", async () => {
    await runTest(11, async () => {
      await clickAndNavigateSymmetric();
      await returnToMainPageAndWait();
    });
  });

  test("Should correctly retrieve empty keys after Symmetric is done", async () => {
    await retrieveDOMGenPrivateKeys();

    assertDOMGenKeys();
    assertAttachments();
  });

  test("Navigation and interaction to generate keys (Asymmetric)", async () => {
    await runTest(11, async () => {
      await clickAndNavigateAsymmetric();
      await returnToMainPageAndWait();
    });
  });

  test("Should correctly retrieve empty keys after Asymmetric is done", async () => {
    await retrieveDOMGenPrivateKeys();

    assertDOMGenKeys();
    assertAttachments();
  });

  test("Navigation and interaction to generate keys (Transformation)", async () => {
    await runTest(11, async () => {
      await clickAndNavigateTransformation();
      await returnToMainPageAndWait();
    });
  });

  test("Should correctly retrieve empty keys after Transformation is done", async () => {
    await retrieveDOMGenPrivateKeys();

    assertDOMGenKeys();
    assertAttachments();
  });

  test("Navigation and interaction to generate keys (Symmetric) again", async () => {
    await clickAndNavigateSymmetric();
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

    await returnToMainPageAndWait();
  });

  test("Navigation and interaction to generate keys (Asymmetric) again", async () => {
    await clickAndNavigateAsymmetric();
  });

  test("Should correctly retrieve correct keys after Asymmetric is done", async () => {
    await retrieveDOMGenPrivateKeys();

    // Update the expected keys.
    idsBySk = {
      dflex_sk_0_34: [
        "async-meeting-laura",
        "async-weekly-meetup",
        "async-project-work",
        "async-gym-session",
      ],
      dflex_sk_1_0: ["asymmetric-container-list"],
    };
    SKByDepth = {
      "0": ["dflex_sk_0_34"],
      "1": ["dflex_sk_1_0"],
    };
    branchesRegistry = {
      dflex_bk_34: {
        "0": {
          ids: [
            "async-meeting-laura",
            "async-weekly-meetup",
            "async-project-work",
            "async-gym-session",
          ],
          SK: "dflex_sk_0_34",
        },
        "1": { ids: ["asymmetric-container-list"], SK: "dflex_sk_1_0" },
      },
    };

    assertDOMGenKeys();

    await returnToMainPageAndWait();
  });

  test("Navigation and interaction to generate keys (Transformation) again", async () => {
    await clickAndNavigateTransformation();
  });

  test("Should correctly retrieve correct keys after Transformation is done", async () => {
    await retrieveDOMGenPrivateKeys();

    // Update the expected keys.
    idsBySk = {
      dflex_sk_0_35: ["trans-clean", "trans-shop", "trans-gym"],
      dflex_sk_1_0: ["trans-container-list"],
    };
    SKByDepth = { "0": ["dflex_sk_0_35"], "1": ["dflex_sk_1_0"] };
    branchesRegistry = {
      dflex_bk_35: {
        "0": {
          ids: ["trans-clean", "trans-shop", "trans-gym"],
          SK: "dflex_sk_0_35",
        },
        "1": { ids: ["trans-container-list"], SK: "dflex_sk_1_0" },
      },
    };

    assertDOMGenKeys();

    await returnToMainPageAndWait();
  });

  test("Keys should be destroyed when returning to main page", async () => {
    await retrieveDOMGenPrivateKeys();

    idsBySk = {};
    SKByDepth = {};
    branchesRegistry = {};

    assertDOMGenKeys();
  });
});
