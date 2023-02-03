import Generator, { Pointer } from "../src";

const PREFIX_KY = "dflex_ky_";

const domGen = new Generator();

let pointerChild0D0: Pointer;
let pointerChild1D0: Pointer;
let pointerChild2D0: Pointer;

const KEYS_CHILDREN_D0 = {
  CHK: null,
  PK: `${PREFIX_KY}1_0`,
  SK: `${PREFIX_KY}0_0`,
};

let pointerParent0D1: Pointer;
let pointerGrandParent0D2: Pointer;

let pointerChild3D0: Pointer;

describe("DOM Relationship Generator: Ascending-Simple", () => {
  describe("Working on same level: zero(0) depth", () => {
    beforeAll(() => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

      pointerChild0D0 = domGen.register("id-0", 0);
    });

    it("Adds the new element starting at depth zero(0) with the correct pointer", () => {
      expect(pointerChild0D0).toStrictEqual({
        keys: KEYS_CHILDREN_D0,
        order: {
          parent: 0,
          self: 0,
        },
      });
    });

    it("Has a new branch contains the registered element-id", () => {
      const branch = domGen.getElmBranchByKey(pointerChild0D0.keys.SK);
      expect(branch).toStrictEqual(["id-0"]);
    });

    it("Adds the new branch into its depth", () => {
      expect(domGen.getBranchByDepth(0)).toStrictEqual([`${PREFIX_KY}0_0`]);
    });

    it("Preserves keys and parent index for element with same level", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
      // │
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

      pointerChild1D0 = domGen.register("id-1", 0);

      expect(pointerChild1D0).toStrictEqual({
        keys: KEYS_CHILDREN_D0,
        order: {
          parent: pointerChild0D0.order.parent,
          self: pointerChild0D0.order.self + 1,
        },
      });

      let branch = domGen.getElmBranchByKey(pointerChild0D0.keys.SK);

      expect(branch).toStrictEqual(["id-0", "id-1"]);

      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
      // │
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
      // │
      // │───id-2  => (order:{parent: 0, self: 2 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

      pointerChild2D0 = domGen.register("id-2", 0);

      expect(pointerChild2D0).toStrictEqual({
        keys: KEYS_CHILDREN_D0,
        order: {
          parent: pointerChild1D0.order.parent,
          self: pointerChild1D0.order.self + 1,
        },
      });

      branch = domGen.getElmBranchByKey(pointerChild2D0.keys.SK);

      expect(branch).toStrictEqual(["id-0", "id-1", "id-2"]);
    });

    it("Preserve the branch key grouped with its depth", () => {
      expect(domGen.getBranchByDepth(0)).toMatchInlineSnapshot(`
        [
          "dflex_ky_0_0",
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

      pointerParent0D1 = domGen.register("id-parent-1", 1);

      expect(pointerChild0D0.keys.PK).toBe(pointerParent0D1.keys.SK);
      expect(pointerChild1D0.keys.PK).toBe(pointerParent0D1.keys.SK);
      expect(pointerChild2D0.keys.PK).toBe(pointerParent0D1.keys.SK);

      expect(pointerParent0D1).toStrictEqual({
        keys: {
          CHK: `${PREFIX_KY}0_0`,
          PK: `${PREFIX_KY}2_0`,
          SK: `${PREFIX_KY}1_0`,
        },
        order: {
          parent: 0,
          self: 0,
        },
      });

      const branch = domGen.getElmBranchByKey(pointerParent0D1.keys.SK);

      expect(branch).toStrictEqual(["id-parent-1"]);
    });

    it("Add the new branch key (parent branch) to its depth", () => {
      expect(domGen.getBranchByDepth(0)).toStrictEqual([`${PREFIX_KY}0_0`]);
      expect(domGen.getBranchByDepth(1)).toStrictEqual([`${PREFIX_KY}1_0`]);
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

      pointerGrandParent0D2 = domGen.register("id-grand-parent-1", 2);

      expect(pointerParent0D1.keys.PK).toBe(pointerGrandParent0D2.keys.SK);

      expect(pointerGrandParent0D2).toStrictEqual({
        keys: {
          CHK: `${PREFIX_KY}1_0`,
          PK: `${PREFIX_KY}3_0`,
          SK: `${PREFIX_KY}2_0`,
        },
        order: {
          parent: 0,
          self: 0,
        },
      });

      const branch = domGen.getElmBranchByKey(pointerGrandParent0D2.keys.SK);

      expect(branch).toStrictEqual(["id-grand-parent-1"]);
    });

    it("Add the new branch key (grand branch) to its depth", () => {
      expect(domGen.getBranchByDepth(0)).toStrictEqual([`${PREFIX_KY}0_0`]);
      expect(domGen.getBranchByDepth(1)).toStrictEqual([`${PREFIX_KY}1_0`]);
      expect(domGen.getBranchByDepth(2)).toStrictEqual([`${PREFIX_KY}2_0`]);
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

      pointerChild3D0 = domGen.register("id-00", 0);

      expect(pointerChild3D0.keys).not.toBe(KEYS_CHILDREN_D0);

      expect(pointerChild3D0.order.parent).not.toBe(
        pointerChild0D0.order.parent
      );

      expect(pointerChild3D0).toStrictEqual({
        keys: {
          CHK: null,
          PK: `${PREFIX_KY}1_1`,
          SK: `${PREFIX_KY}0_1`,
        },
        order: {
          parent: 1,
          self: 0,
        },
      });

      const branch = domGen.getElmBranchByKey(pointerChild3D0.keys.SK);

      expect(branch).toStrictEqual(["id-00"]);
    });

    it("Add the new branch key to the existing depth array", () => {
      expect(domGen.getBranchByDepth(0)).toStrictEqual([
        `${PREFIX_KY}0_0`,
        `${PREFIX_KY}0_1`,
      ]);
      expect(domGen.getBranchByDepth(1)).toStrictEqual([`${PREFIX_KY}1_0`]);
      expect(domGen.getBranchByDepth(2)).toStrictEqual([`${PREFIX_KY}2_0`]);
    });

    it("Throws when updating non-existing branch", () => {
      expect(() => domGen.updateBranch("xx", [])).toThrow();
    });

    it("Updates branch by key", () => {
      const branch = domGen.getElmBranchByKey(pointerChild2D0.keys.SK);
      expect(branch).toStrictEqual(["id-0", "id-1", "id-2"]);

      domGen.updateBranch(pointerChild2D0.keys.SK, []);
      const branchUpdated = domGen.getElmBranchByKey(pointerChild2D0.keys.SK);
      expect(branchUpdated).toStrictEqual([]);
    });
  });
});
