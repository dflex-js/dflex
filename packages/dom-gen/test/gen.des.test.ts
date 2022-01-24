import Generator from "../src";

const domGen = new Generator();

let pointerParent0D3;
let pointerParent1D3;

let pointerChild0D2;

let pointeGrandChild0D1;

describe("DOM Relationship Generator: Descending-Simple", () => {
  describe("Working on same level: third(3) depth", () => {
    it("Adds new element starting at third(3) depth", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: "0-0",PK: "4-0",SK: "3-0"})

      pointerParent0D3 = domGen.getElmPointer("id-0", 3);

      // parents should always have children keys
      // @ts-expect-error
      expect([pointerParent0D3.keys].CHK).not.toBe(null);

      expect(pointerParent0D3).toStrictEqual({
        keys: {
          CHK: "0-0",
          PK: "4-0",
          SK: "3-0",
        },
        order: {
          parent: 0,
          self: 0,
        },
      });
    });

    it("Generates different children key for new parent even form the same node level", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: "0-0",PK: "4-0",SK: "3-0"})
      // |
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: "3-0",PK: "4-0",SK: "3-0"})

      pointerParent1D3 = domGen.getElmPointer("id-1", 3);

      // parents should always have children keys
      expect(pointerParent1D3.keys.CHK).not.toBe(null);

      // parents have different children
      expect(pointerParent1D3.keys.CHK).not.toBe(pointerParent0D3.keys.CHK);
    });

    it("Preserves index incrementing", () => {
      expect(pointerParent1D3).toStrictEqual({
        keys: {
          CHK: "3-0",
          PK: "4-0",
          SK: pointerParent0D3.keys.SK, // "3-0",
        },
        order: {
          parent: 0,
          self: 1,
        },
      });
    });
  });

  describe("Going down for testing children", () => {
    it("Being able to attach new children to last parent", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: "0-0",PK: "4-0",SK: "3-0"})
      // |
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: "3-0",PK: "4-0",SK: "3-0"})
      //     |
      //     │───id-2  => (order:{parent: 1, self: 0 }) || (keys: {CHK: "3-0",PK: "3-0",SK: "2-0"})

      pointerChild0D2 = domGen.getElmPointer("id-2", 2);

      expect(pointerChild0D2).toStrictEqual({
        keys: {
          CHK: "3-0",
          PK: pointerParent1D3.keys.CHK,
          SK: "2-1",
        },
        order: {
          parent: pointerParent1D3.order.self, // 1
          self: 0,
        },
      });
    });

    it("Adds new grand children correctly", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: "0-0",PK: "4-0",SK: "3-0"})
      // |
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: "3-0",PK: "4-0",SK: "3-0"})
      //     |
      //     │───id-2  => (order:{parent: 1, self: 0 }) || (keys: {CHK: "3-0",PK: "3-0",SK: "2-0"})
      //         |
      //         │───id-3  => (order:{parent: 1, self: 0 }) || (keys: {CHK: "2-1",PK: "3-0",SK: "2-1"})

      pointeGrandChild0D1 = domGen.getElmPointer("id-3", 1);

      expect(pointeGrandChild0D1).toStrictEqual({
        keys: {
          CHK: "2-1",
          PK: pointeGrandChild0D1.keys.CHK,
          SK: "1-0",
        },
        order: {
          parent: pointeGrandChild0D1.order.self, // 1
          self: 0,
        },
      });
    });
  });
});
