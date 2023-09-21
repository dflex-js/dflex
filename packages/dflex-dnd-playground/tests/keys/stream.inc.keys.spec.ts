/* eslint-disable no-underscore-dangle */
import { BrowserContext, Page, expect } from "@playwright/test";

import {
  DEVELOPMENT_ONLY_ASSERTION,
  isProdBundle,
  DFlexPageTest as test,
} from "dflex-e2e-utils";
import { DOMGenKeysType } from "../utils/sharedTypes";

test.describe
  .serial("Testing DFlex generated keys by accessing window for stream inc page", async () => {
  test.skip(isProdBundle, DEVELOPMENT_ONLY_ASSERTION);

  let context: BrowserContext;

  let page: Page;

  let DOMGenKeys: DOMGenKeysType;

  const SKByDepth = {
    "0": ["dflex_sk_0_0", "dflex_sk_0_1"],
    "1": ["dflex_sk_1_0"],
  };

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("/stream-inc");
  });

  test.afterAll(async () => {
    await context.close();
    await page.close();
  });

  test.describe("Initial", () => {
    const idsBySk = {
      // depth-1
      dflex_sk_1_0: ["dflex_id_0", "dflex_id_1"],

      // depth-0
      dflex_sk_0_0: ["a-0"],
      dflex_sk_0_1: ["b-0"],
    };

    const branchesRegistry = {
      dflex_bk_0: {
        "0": { ids: ["a-0"], SK: "dflex_sk_0_0" },
        "1": { ids: ["dflex_id_0"], SK: "dflex_sk_1_0" },
      },
      dflex_bk_1: {
        "0": { ids: ["b-0"], SK: "dflex_sk_0_1" },
        "1": { ids: ["dflex_id_1"], SK: "dflex_sk_1_0" },
      },
    };

    test.beforeAll(async () => {
      await page.waitForFunction(() => {
        return window.$DFlex && window.$DFlex.DOMGen._DEV_getPrivateKeys;
      });

      const handle = await page.evaluateHandle(() => {
        return window.$DFlex.DOMGen._DEV_getPrivateKeys()!;
      });

      DOMGenKeys = await handle.jsonValue();
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

  test.describe("First round", () => {
    const idsBySk = {
      dflex_sk_1_0: ["dflex_id_0", "dflex_id_1"],

      dflex_sk_0_0: [
        "a-0",
        "a-1", // first round.
        "a-2",
        "a-3",
        "a-4",
      ],
      dflex_sk_0_1: [
        "b-0",
        "b-1", // first round.
        "b-2",
        "b-3",
        "b-4",
      ],
    };

    const branchesRegistry = {
      dflex_bk_0: {
        "0": {
          ids: ["a-0", "a-1", "a-2", "a-3", "a-4"],
          SK: "dflex_sk_0_0",
        },
        "1": { ids: ["dflex_id_0"], SK: "dflex_sk_1_0" },
      },
      dflex_bk_1: {
        "0": {
          ids: ["b-0", "b-1", "b-2", "b-3", "b-4"],
          SK: "dflex_sk_0_1",
        },
        "1": { ids: ["dflex_id_1"], SK: "dflex_sk_1_0" },
      },
    };

    test.beforeAll(async ({ browserName }) => {
      await page.keyboard.press("r", {
        delay: browserName === "webkit" ? 150 : 50,
      });

      await page.waitForFunction(() => {
        return window.$DFlex && window.$DFlex.DOMGen._DEV_getPrivateKeys;
      });

      const handle = await page.evaluateHandle(() => {
        return window.$DFlex.DOMGen._DEV_getPrivateKeys()!;
      });

      DOMGenKeys = await handle.jsonValue();
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

  test.describe("Second round", () => {
    const idsBySk = {
      dflex_sk_1_0: ["dflex_id_0", "dflex_id_1"],

      dflex_sk_0_0: [
        "a-0",
        "a-1",
        "a-2",
        "a-3",
        "a-4",
        "a-5", // second round.
        "a-6",
        "a-7",
        "a-8",
        "a-9",
      ],
      dflex_sk_0_1: [
        "b-0",
        "b-1",
        "b-2",
        "b-3",
        "b-4",
        "b-5", // second round.
        "b-6",
        "b-7",
        "b-8",
        "b-9",
      ],
    };

    const branchesRegistry = {
      dflex_bk_0: {
        "0": {
          ids: [
            "a-0",
            "a-1",
            "a-2",
            "a-3",
            "a-4",
            "a-5",
            "a-6",
            "a-7",
            "a-8",
            "a-9",
          ],
          SK: "dflex_sk_0_0",
        },
        "1": { ids: ["dflex_id_0"], SK: "dflex_sk_1_0" },
      },
      dflex_bk_1: {
        "0": {
          ids: [
            "b-0",
            "b-1",
            "b-2",
            "b-3",
            "b-4",
            "b-5",
            "b-6",
            "b-7",
            "b-8",
            "b-9",
          ],
          SK: "dflex_sk_0_1",
        },
        "1": { ids: ["dflex_id_1"], SK: "dflex_sk_1_0" },
      },
    };

    test.beforeAll(async ({ browserName }) => {
      await page.keyboard.press("r", {
        delay: browserName === "webkit" ? 150 : 50,
      });

      await page.waitForFunction(() => {
        return window.$DFlex && window.$DFlex.DOMGen._DEV_getPrivateKeys;
      });

      const handle = await page.evaluateHandle(() => {
        return window.$DFlex.DOMGen._DEV_getPrivateKeys()!;
      });

      DOMGenKeys = await handle.jsonValue();
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

  test.describe("Third round", () => {
    const idsBySk = {
      dflex_sk_1_0: ["dflex_id_0", "dflex_id_1"],

      dflex_sk_0_0: [
        "a-0",
        "a-1",
        "a-2",
        "a-3",
        "a-4",
        "a-5", // second round.
        "a-6",
        "a-7",
        "a-8",
        "a-9", // third round.
        "a-10",
        "a-11",
        "a-12",
        "a-13",
        "a-14",
      ],
      dflex_sk_0_1: [
        "b-0",
        "b-1",
        "b-2",
        "b-3",
        "b-4",
        "b-5", // second round.
        "b-6",
        "b-7",
        "b-8",
        "b-9", // third round.
        "b-10",
        "b-11",
        "b-12",
        "b-13",
        "b-14",
      ],
    };

    const branchesRegistry = {
      dflex_bk_0: {
        "0": {
          ids: [
            "a-0",
            "a-1",
            "a-2",
            "a-3",
            "a-4",
            "a-5",
            "a-6",
            "a-7",
            "a-8",
            "a-9",
            "a-10",
            "a-11",
            "a-12",
            "a-13",
            "a-14",
          ],
          SK: "dflex_sk_0_0",
        },
        "1": { ids: ["dflex_id_0"], SK: "dflex_sk_1_0" },
      },
      dflex_bk_1: {
        "0": {
          ids: [
            "b-0",
            "b-1",
            "b-2",
            "b-3",
            "b-4",
            "b-5",
            "b-6",
            "b-7",
            "b-8",
            "b-9",
            "b-10",
            "b-11",
            "b-12",
            "b-13",
            "b-14",
          ],
          SK: "dflex_sk_0_1",
        },
        "1": { ids: ["dflex_id_1"], SK: "dflex_sk_1_0" },
      },
    };

    test.beforeAll(async ({ browserName }) => {
      await page.keyboard.press("r", {
        delay: browserName === "webkit" ? 150 : 50,
      });

      await page.waitForFunction(() => {
        return window.$DFlex && window.$DFlex.DOMGen._DEV_getPrivateKeys;
      });

      const handle = await page.evaluateHandle(() => {
        return window.$DFlex.DOMGen._DEV_getPrivateKeys()!;
      });

      DOMGenKeys = await handle.jsonValue();
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

  test.describe("Fourth round", () => {
    const idsBySk = {
      dflex_sk_1_0: ["dflex_id_0", "dflex_id_1"],

      dflex_sk_0_0: [
        "a-0",
        "a-1",
        "a-2",
        "a-3",
        "a-4",
        "a-5", // second round.
        "a-6",
        "a-7",
        "a-8",
        "a-9", // third round.
        "a-10",
        "a-11",
        "a-12",
        "a-13",
        "a-14",
        "a-15", // fourth round.
        "a-16",
        "a-17",
        "a-18",
        "a-19",
      ],
      dflex_sk_0_1: [
        "b-0",
        "b-1",
        "b-2",
        "b-3",
        "b-4",
        "b-5", // second round.
        "b-6",
        "b-7",
        "b-8",
        "b-9", // third round.
        "b-10",
        "b-11",
        "b-12",
        "b-13",
        "b-14",
        "b-15", // fourth round.
        "b-16",
        "b-17",
        "b-18",
        "b-19",
      ],
    };

    const branchesRegistry = {
      dflex_bk_0: {
        "0": {
          ids: [
            "a-0",
            "a-1",
            "a-2",
            "a-3",
            "a-4",
            "a-5",
            "a-6",
            "a-7",
            "a-8",
            "a-9",
            "a-10",
            "a-11",
            "a-12",
            "a-13",
            "a-14",
            "a-15", // fourth round.
            "a-16",
            "a-17",
            "a-18",
            "a-19",
          ],
          SK: "dflex_sk_0_0",
        },
        "1": { ids: ["dflex_id_0"], SK: "dflex_sk_1_0" },
      },
      dflex_bk_1: {
        "0": {
          ids: [
            "b-0",
            "b-1",
            "b-2",
            "b-3",
            "b-4",
            "b-5",
            "b-6",
            "b-7",
            "b-8",
            "b-9",
            "b-10",
            "b-11",
            "b-12",
            "b-13",
            "b-14",
            "b-15", // fourth round.
            "b-16",
            "b-17",
            "b-18",
            "b-19",
          ],
          SK: "dflex_sk_0_1",
        },
        "1": { ids: ["dflex_id_1"], SK: "dflex_sk_1_0" },
      },
    };

    test.beforeAll(async ({ browserName }) => {
      await page.keyboard.press("r", {
        delay: browserName === "webkit" ? 150 : 50,
      });

      await page.waitForFunction(() => {
        return window.$DFlex && window.$DFlex.DOMGen._DEV_getPrivateKeys;
      });

      const handle = await page.evaluateHandle(() => {
        return window.$DFlex.DOMGen._DEV_getPrivateKeys()!;
      });

      DOMGenKeys = await handle.jsonValue();
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
});
