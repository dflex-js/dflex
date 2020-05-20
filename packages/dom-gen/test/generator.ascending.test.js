import Generator from "../src/Generator";

const domGen = new Generator();

describe("DOM Relationship Generator: Ascending-Simple", () => {
  describe("Working on same level: zero(0) depth", () => {
    const expectedKeys = {
      chK: null,
      pK: "1-0",
      sK: "0-0",
    };

    const PARENT_ZERO = 0;

    let pointer;

    it("Adds new element starting at depth zero(0)", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})

      pointer = domGen.getElmPointer("id-0", 0);

      expect(pointer).toStrictEqual({
        keys: expectedKeys,
        order: {
          parent: PARENT_ZERO,
          self: 0,
        },
      });
    });

    it("Preserves keys and parent index for element with same level", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      // │
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})

      pointer = domGen.getElmPointer("id-1", 0);

      expect(pointer).toStrictEqual({
        keys: expectedKeys,
        order: {
          parent: PARENT_ZERO,
          self: 1,
        },
      });

      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      // │
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      // │
      // │───id-2  => (order:{parent: 0, self: 2 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})

      pointer = domGen.getElmPointer("id-2", 0);

      expect(pointer).toStrictEqual({
        keys: expectedKeys,
        order: {
          parent: PARENT_ZERO,
          self: 2,
        },
      });
    });
  });

  describe("Works on parents in higher depth", () => {
    it("Adds new elements as parent", () => {
      const expectedKeys = {
        chK: "0-0",
        pK: "2-0",
        sK: "1-0",
      };

      // DOM-root
      // ├───id-parent-1 (order:{parent: 0, self: 0 })   || (keys: {chK: "0-0",pK: "2-0",sK: "1-0"})
      //     |
      //     │───id-0  => (order:{parent: 0, self: 0 })  || (keys: {chK: null,pK: "1-0",sK: "0-0"})
      //     │
      //     │───id-1 => ..
      //     │
      //     │───id-2 => ..

      const pointer = domGen.getElmPointer("id-parent-1", 1);

      expect(pointer).toStrictEqual({
        keys: expectedKeys,
        order: {
          parent: 0,
          self: 0,
        },
      });
    });

    it("Adds new elements as grand parent", () => {
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

      const pointer = domGen.getElmPointer("id-grand-parent-1", 2);

      const expectedKeys = {
        chK: "1-0",
        pK: "3-0",
        sK: "2-0",
      };

      expect(pointer).toStrictEqual({
        keys: expectedKeys,
        order: {
          parent: 0,
          self: 0,
        },
      });
    });
  });

  describe("Add new node starting from zero again", () => {
    it("Adds new elements as grand parent", () => {
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

      const pointer = domGen.getElmPointer("id-00", 0);

      const expectedKeys = {
        chK: null,
        pK: "1-1",
        sK: "0-1",
      };

      expect(pointer).toStrictEqual({
        keys: expectedKeys,
        order: {
          parent: 1,
          self: 0,
        },
      });
    });
  });
});
