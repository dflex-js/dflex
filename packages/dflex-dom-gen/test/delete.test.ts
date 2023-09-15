import Generator, { Pointer } from "../src";

const domGen = new Generator();

let pointerChild0D0: Pointer;
let pointerChild1D0: Pointer;

describe("Testing clear methods", () => {
  beforeAll(() => {
    // DOM-root
    // │
    // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
    // │
    // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

    pointerChild0D0 = domGen.register("id-0", 0, false);
    pointerChild1D0 = domGen.register("id-1", 0, false);
  });

  it("Generates two pointers correctly", () => {
    expect(pointerChild0D0).toMatchInlineSnapshot(`
      {
        "keys": {
          "BK": "dflex_bk_0",
          "CHK": null,
          "PK": "dflex_ky_1_0",
          "SK": "dflex_sk_0_0",
        },
        "order": {
          "parent": 0,
          "self": 0,
        },
      }
    `);

    expect(pointerChild1D0).toMatchInlineSnapshot(`
      {
        "keys": {
          "BK": "dflex_bk_0",
          "CHK": null,
          "PK": "dflex_ky_1_0",
          "SK": "dflex_sk_0_0",
        },
        "order": {
          "parent": 0,
          "self": 1,
        },
      }
    `);
  });

  it("The new generated branch has correct registered ids", () => {
    const branch = domGen.getSiblingsByKey(pointerChild0D0.keys.SK);

    expect(branch).toStrictEqual(["id-0", "id-1"]);
  });

  it("The new generated branch has its key inside the branch depth array", () => {
    expect(domGen.getSKByDepth(0)).toMatchInlineSnapshot(`
      [
        "dflex_sk_0_0",
      ]
    `);
  });

  it("The branch depth array still has the branch key", () => {
    expect(domGen.getSKByDepth(0)).toMatchInlineSnapshot(`
      [
        "dflex_sk_0_0",
      ]
    `);
  });

  // it("Destroy branch", () => {
  //   domGen.destroySiblings("dflex_sk_0_0");

  //   const branch = domGen.getSiblingsByKey(pointerChild0D0.keys.SK);

  //   expect(branch).toStrictEqual([]);
  // });

  it("Adds two siblings again", () => {
    // DOM-root
    // │
    // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
    // │
    // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

    pointerChild0D0 = domGen.register("id-0", 0, false);
    pointerChild1D0 = domGen.register("id-1", 0, false);

    expect(pointerChild0D0).toMatchInlineSnapshot(`
      {
        "keys": {
          "BK": "dflex_bk_0",
          "CHK": null,
          "PK": "dflex_ky_1_0",
          "SK": "dflex_sk_0_0",
        },
        "order": {
          "parent": 0,
          "self": 2,
        },
      }
    `);

    expect(pointerChild1D0).toMatchInlineSnapshot(`
      {
        "keys": {
          "BK": "dflex_bk_0",
          "CHK": null,
          "PK": "dflex_ky_1_0",
          "SK": "dflex_sk_0_0",
        },
        "order": {
          "parent": 0,
          "self": 3,
        },
      }
    `);

    const branch = domGen.getSiblingsByKey(pointerChild0D0.keys.SK);

    expect(branch).toMatchInlineSnapshot(`
      [
        "id-0",
        "id-1",
        "id-0",
        "id-1",
      ]
    `);
    expect(domGen.getSKByDepth(0)).toMatchInlineSnapshot(`
      [
        "dflex_sk_0_0",
      ]
    `);
  });
});
