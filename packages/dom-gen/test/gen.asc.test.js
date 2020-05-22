import Generator from "../src/Generator";

const domGen = new Generator();

let pointerChild0D0;
let pointerChild1D0;
let pointerChild2D0;

const KEYS_CHILDREN_D0 = {
  chK: null,
  pK: "1-0",
  sK: "0-0",
};

let pointerParent0D1;
let pointerGrandParent0D2;

let pointerChild3D0;

describe("DOM Relationship Generator: Ascending-Simple", () => {
  describe("Working on same level: zero(0) depth", () => {
    it("Adds new element starting at depth zero(0)", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})

      pointerChild0D0 = domGen.getElmPointer("id-0", 0);

      expect(pointerChild0D0).toStrictEqual({
        keys: KEYS_CHILDREN_D0,
        order: {
          parent: 0,
          self: 0,
        },
      });

      const branch = domGen.getElmBranch(pointerChild0D0.keys.sK);

      expect(branch).toBe("id-0");
    });

    it("Preserves keys and parent index for element with same level", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      // │
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})

      pointerChild1D0 = domGen.getElmPointer("id-1", 0);

      expect(pointerChild1D0).toStrictEqual({
        keys: KEYS_CHILDREN_D0,
        order: {
          parent: pointerChild0D0.order.parent,
          self: pointerChild0D0.order.self + 1,
        },
      });

      let branch = domGen.getElmBranch(pointerChild0D0.keys.sK);

      expect(branch).toStrictEqual(["id-0", "id-1"]);

      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      // │
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      // │
      // │───id-2  => (order:{parent: 0, self: 2 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})

      pointerChild2D0 = domGen.getElmPointer("id-2", 0);

      expect(pointerChild2D0).toStrictEqual({
        keys: KEYS_CHILDREN_D0,
        order: {
          parent: pointerChild1D0.order.parent,
          self: pointerChild1D0.order.self + 1,
        },
      });

      branch = domGen.getElmBranch(pointerChild2D0.keys.sK);

      expect(branch).toStrictEqual(["id-0", "id-1", "id-2"]);
    });
  });

  describe("Works on parents in higher depth", () => {
    it("Identifies parent connects it with right node children with sk/pk", () => {
      // DOM-root
      // ├───id-parent-1 (order:{parent: 0, self: 0 })   || (keys: {chK: "0-0",pK: "2-0",sK: "1-0"})
      //     |
      //     │───id-0  => (order:{parent: 0, self: 0 })  || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      //     │
      //     │───id-1 => ..
      //     │
      //     │───id-2 => ..

      pointerParent0D1 = domGen.getElmPointer("id-parent-1", 1);

      expect(pointerChild0D0.keys.pK).toBe(pointerParent0D1.keys.sK);
      expect(pointerChild1D0.keys.pK).toBe(pointerParent0D1.keys.sK);
      expect(pointerChild2D0.keys.pK).toBe(pointerParent0D1.keys.sK);

      expect(pointerParent0D1).toStrictEqual({
        keys: {
          chK: "0-0",
          pK: "2-0",
          sK: "1-0",
        },
        order: {
          parent: 0,
          self: 0,
        },
      });

      const branch = domGen.getElmBranch(pointerParent0D1.keys.sK);

      expect(branch).toBe("id-parent-1");
    });

    it("Identifies grand parent connects its branch", () => {
      // DOM-root
      // ├───id-grand-parent-1  (order:{parent: 0, self: 0 }) ||  (keys: {chK: "1-0",pK: "3-0",sK: "2-0"})
      //     |
      //     ├───id-parent-1 => (order:{parent: 0, self: 0 }) || (keys: {chK: "0-0",pK: "2-0",sK: "1-0"})
      //         |
      //         │───id-0  => (order:{parent: 0, self: 0 })  || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      //         │
      //         │───id-1 => ..
      //         │
      //         │───id-2 => ..

      pointerGrandParent0D2 = domGen.getElmPointer("id-grand-parent-1", 2);

      expect(pointerParent0D1.keys.pK).toBe(pointerGrandParent0D2.keys.sK);

      expect(pointerGrandParent0D2).toStrictEqual({
        keys: {
          chK: "1-0",
          pK: "3-0",
          sK: "2-0",
        },
        order: {
          parent: 0,
          self: 0,
        },
      });

      const branch = domGen.getElmBranch(pointerGrandParent0D2.keys.sK);

      expect(branch).toBe("id-grand-parent-1");
    });
  });

  describe("Add new node starting from zero again", () => {
    it("Connects the child with its parent matching index and key", () => {
      // DOM-root
      // ├───id-grand-parent-1  (order:{parent: 0, self: 0 }) ||  (keys: {chK: "1-0",pK: "3-0",sK: "2-0"})
      //     |
      //     ├───id-parent-1 => (order:{parent: 0, self: 0 }) || (keys: {chK: "0-0",pK: "2-0",sK: "1-0"})
      //         |
      //         │───id-0  => (order:{parent: 0, self: 0 })  || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      //         │
      //         │───id-1 => ..
      //         │
      //         │───id-2 => ..
      //
      // ├───id-00  (order:{parent: 1, self: 0 }) ||  (keys: {chK: null,pK: "1-1",sK: "0-1"})

      pointerChild3D0 = domGen.getElmPointer("id-00", 0);

      expect(pointerChild3D0.keys).not.toBe(KEYS_CHILDREN_D0);

      expect(pointerChild3D0.order.parent).not.toBe(
        pointerChild0D0.order.parent
      );

      expect(pointerChild3D0).toStrictEqual({
        keys: {
          chK: null,
          pK: "1-1",
          sK: "0-1",
        },
        order: {
          parent: 1,
          self: 0,
        },
      });

      const branch = domGen.getElmBranch(pointerChild3D0.keys.sK);

      expect(branch).toBe("id-00");
    });
  });

  describe("Dealing with branches", () => {
    it("Returns all of branches correctly", () => {
      const { branches } = domGen;

      expect(branches).toStrictEqual({
        "0-0": ["id-0", "id-1", "id-2"],
        "1-0": "id-parent-1",
        "2-0": "id-grand-parent-1",
        "0-1": "id-00",
      });
    });

    it("Updates branches correctly", () => {
      const newBranch = ["id-2", "id-1", "id-0"];

      domGen.setElmBranch("0-0", newBranch);

      const { branches } = domGen;

      expect(branches).toStrictEqual({
        "0-0": newBranch,
        "1-0": "id-parent-1",
        "2-0": "id-grand-parent-1",
        "0-1": "id-00",
      });
    });
  });
});
