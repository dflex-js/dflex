import Generator, { Pointer } from "../src";

const domGen = new Generator();

let pointerChild0D0: Pointer;
let pointerChild1D0: Pointer;
let pointerChild2D0: Pointer;

let pointerParent0D1: Pointer;
let pointerGrandParent0D2: Pointer;

let pointerChild3D0: Pointer;

describe("DOM Relationship Generator: Ascending-Simple", () => {
  describe("Working on same level: zero(0) depth", () => {
    beforeAll(() => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

      pointerChild0D0 = domGen.register("id-0", 0, false);
    });

    it("Adds the new element starting at depth zero(0) with the correct pointer", () => {
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
    });

    it("Has a new branch contains the registered element-id", () => {
      const branch = domGen.getSiblingsByKey(pointerChild0D0.keys.SK);
      expect(branch).toMatchInlineSnapshot(`
        [
          "id-0",
        ]
      `);
    });

    it("Adds the new branch into its depth", () => {
      expect(domGen.getSKByDepth(0)).toMatchInlineSnapshot(`
        [
          "dflex_sk_0_0",
        ]
      `);
    });

    it("Preserves keys and parent index for element with same level", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
      // │
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

      pointerChild1D0 = domGen.register("id-1", 0, false);

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

      let siblings = domGen.getSiblingsByKey(pointerChild0D0.keys.SK);

      expect(siblings).toMatchInlineSnapshot(`
        [
          "id-0",
          "id-1",
        ]
      `);

      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
      // │
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
      // │
      // │───id-2  => (order:{parent: 0, self: 2 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

      pointerChild2D0 = domGen.register("id-2", 0, false);

      expect(pointerChild2D0).toMatchInlineSnapshot(`
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

      siblings = domGen.getSiblingsByKey(pointerChild2D0.keys.SK);

      expect(siblings).toMatchInlineSnapshot(`
        [
          "id-0",
          "id-1",
          "id-2",
        ]
      `);
    });

    it("Preserve the branch key grouped with its depth", () => {
      expect(domGen.getSKByDepth(0)).toMatchInlineSnapshot(`
        [
          "dflex_sk_0_0",
        ]
      `);
    });
  });

  describe("Works on parents in higher depth", () => {
    it("Identifies parent connects it with right node children with sk/pk", () => {
      // DOM-root
      // ├───id-parent-1 (order:{parent: 0, self: 0 })   || (keys: {CHK: "0-0",PK: "2-0",SK: "1-0"})
      //     |
      //     │───id-0  => (order:{parent: 0, self: 0 })  || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
      //     │
      //     │───id-1 => ..
      //     │
      //     │───id-2 => ..
      pointerParent0D1 = domGen.register("id-parent-1", 1, false);
      expect(pointerChild0D0.keys.PK).toBe(pointerParent0D1.keys.CHK);
      expect(pointerChild1D0.keys.PK).toBe(pointerParent0D1.keys.CHK);
      expect(pointerChild2D0.keys.PK).toBe(pointerParent0D1.keys.CHK);
      expect(pointerParent0D1).toMatchInlineSnapshot(`
        {
          "keys": {
            "BK": "dflex_bk_0",
            "CHK": "dflex_ky_1_0",
            "PK": "dflex_ky_2_0",
            "SK": "dflex_sk_1_0",
          },
          "order": {
            "parent": 0,
            "self": 0,
          },
        }
      `);
      const siblings = domGen.getSiblingsByKey(pointerParent0D1.keys.SK);
      expect(siblings).toMatchInlineSnapshot(`
        [
          "id-parent-1",
        ]
      `);
    });

    it("Add the new branch key (parent branch) to its depth", () => {
      expect(domGen.getSKByDepth(0)).toMatchInlineSnapshot(`
        [
          "dflex_sk_0_0",
        ]
      `);
      expect(domGen.getSKByDepth(1)).toMatchInlineSnapshot(`
        [
          "dflex_sk_1_0",
        ]
      `);
    });

    it("Identifies grand parent connects its branch", () => {
      // DOM-root
      // ├───id-grand-parent-1  (order:{parent: 0, self: 0 }) ||  (keys: {CHK: "1-0",PK: "3-0",SK: "2-0"})
      //     |
      //     ├───id-parent-1 => (order:{parent: 0, self: 0 }) || (keys: {CHK: "0-0",PK: "2-0",SK: "1-0"})
      //         |
      //         │───id-0  => (order:{parent: 0, self: 0 })  || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
      //         │
      //         │───id-1 => ..
      //         │
      //         │───id-2 => ..
      pointerGrandParent0D2 = domGen.register("id-grand-parent-1", 2, false);
      expect(pointerParent0D1.keys.PK).toBe(pointerGrandParent0D2.keys.CHK);
      expect(pointerGrandParent0D2).toMatchInlineSnapshot(`
        {
          "keys": {
            "BK": "dflex_bk_0",
            "CHK": "dflex_ky_2_0",
            "PK": "dflex_ky_3_0",
            "SK": "dflex_sk_2_0",
          },
          "order": {
            "parent": 0,
            "self": 0,
          },
        }
      `);
      const branch = domGen.getSiblingsByKey(pointerGrandParent0D2.keys.SK);
      expect(branch).toStrictEqual(["id-grand-parent-1"]);
    });

    it("Add the new branch key (grand branch) to its depth", () => {
      expect(domGen.getSKByDepth(0)).toMatchInlineSnapshot(`
        [
          "dflex_sk_0_0",
        ]
      `);
      expect(domGen.getSKByDepth(1)).toMatchInlineSnapshot(`
        [
          "dflex_sk_1_0",
        ]
      `);
      expect(domGen.getSKByDepth(2)).toMatchInlineSnapshot(`
        [
          "dflex_sk_2_0",
        ]
      `);
    });
  });

  describe("Add new node starting from zero again", () => {
    it("Connects the child with its parent matching index and key", () => {
      // DOM-root
      // ├───id-grand-parent-1  (order:{parent: 0, self: 0 }) ||  (keys: {CHK: "1-0",PK: "3-0",SK: "2-0"})
      //     |
      //     ├───id-parent-1 => (order:{parent: 0, self: 0 }) || (keys: {CHK: "0-0",PK: "2-0",SK: "1-0"})
      //         |
      //         │───id-0  => (order:{parent: 0, self: 0 })  || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
      //         │
      //         │───id-1 => ..
      //         │
      //         │───id-2 => ..
      //
      // ├───id-00  (order:{parent: 1, self: 0 }) ||  (keys: {CHK: null,PK: "1-1",SK: "0-1"})
      pointerChild3D0 = domGen.register("id-00", 0, false);
      expect(pointerChild3D0.order.parent).not.toBe(
        pointerChild0D0.order.parent,
      );
      expect(pointerChild3D0).toMatchInlineSnapshot(`
        {
          "keys": {
            "BK": "dflex_bk_1",
            "CHK": null,
            "PK": "dflex_ky_1_1",
            "SK": "dflex_sk_0_1",
          },
          "order": {
            "parent": 1,
            "self": 0,
          },
        }
      `);
      const siblings = domGen.getSiblingsByKey(pointerChild3D0.keys.SK);
      expect(siblings).toMatchInlineSnapshot(`
        [
          "id-00",
        ]
      `);
    });

    it("Add the new branch key to the existing depth array", () => {
      expect(domGen.getSKByDepth(0)).toMatchInlineSnapshot(`
        [
          "dflex_sk_0_0",
          "dflex_sk_0_1",
        ]
      `);
      expect(domGen.getSKByDepth(1)).toMatchInlineSnapshot(`
        [
          "dflex_sk_1_0",
        ]
      `);
      expect(domGen.getSKByDepth(2)).toMatchInlineSnapshot(`
        [
          "dflex_sk_2_0",
        ]
      `);
    });

    it("Throws when updating non-existing siblings", () => {
      expect(() => domGen.mutateSiblings("xx", [])).toThrow();
    });

    it("Updates branch by key", () => {
      const siblings = domGen.getSiblingsByKey(pointerChild2D0.keys.SK);
      expect(siblings).toMatchInlineSnapshot(`
        [
          "id-0",
          "id-1",
          "id-2",
        ]
      `);

      domGen.mutateSiblings(pointerChild2D0.keys.SK, []);
      const updatedSiblings = domGen.getSiblingsByKey(pointerChild2D0.keys.SK);
      expect(updatedSiblings).toStrictEqual([]);
    });
  });
});
