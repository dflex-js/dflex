import Generator, { Pointer } from "../src";

const domGen = new Generator();

let pointerParent0D3: Pointer;
let pointerParent1D3: Pointer;

let pointerChild0D2: Pointer;

let pointeGrandChild0D1: Pointer;

describe("DOM Relationship Generator: Descending-Simple", () => {
  describe("Working on same level: third(3) depth", () => {
    it("Adds new element starting at third(3) depth", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: "0-0",PK: "4-0",SK: "3-0"})

      pointerParent0D3 = domGen.register("id-0", 3, false);

      // parents should always have children keys
      // @ts-expect-error
      expect([pointerParent0D3.keys].CHK).not.toBe(null);

      expect(pointerParent0D3).toMatchInlineSnapshot(`
        {
          "keys": {
            "BK": "dflex_bk_0",
            "CHK": "dflex_ky_0_0",
            "PK": "dflex_ky_4_0",
            "SK": "dflex_sk_3_0",
          },
          "order": {
            "parent": 0,
            "self": 0,
          },
        }
      `);
    });

    it("Generates different children key for new parent even form the same node level", () => {
      // DOM-root
      // │
      // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: "0-0",PK: "4-0",SK: "3-0"})
      // |
      // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: "3-0",PK: "4-0",SK: "3-0"})

      pointerParent1D3 = domGen.register("id-1", 3, false);

      // parents should always have children keys
      expect(pointerParent1D3.keys.CHK).not.toBe(null);

      // parents have different children
      expect(pointerParent1D3.keys.CHK).not.toBe(pointerParent0D3.keys.CHK);
    });

    it("Preserves index incrementing", () => {
      expect(pointerParent1D3).toMatchInlineSnapshot(`
        {
          "keys": {
            "BK": "dflex_bk_0",
            "CHK": "dflex_ky_4_0",
            "PK": "dflex_ky_4_0",
            "SK": "dflex_sk_3_0",
          },
          "order": {
            "parent": 0,
            "self": 1,
          },
        }
      `);
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

      pointerChild0D2 = domGen.register("id-2", 2, false);

      expect(pointerChild0D2).toMatchInlineSnapshot(`
        {
          "keys": {
            "BK": "dflex_bk_1",
            "CHK": "dflex_ky_4_0",
            "PK": "dflex_ky_3_1",
            "SK": "dflex_sk_2_2",
          },
          "order": {
            "parent": 2,
            "self": 0,
          },
        }
      `);
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

      pointeGrandChild0D1 = domGen.register("id-3", 1, false);

      expect(pointeGrandChild0D1).toMatchInlineSnapshot(`
        {
          "keys": {
            "BK": "dflex_bk_2",
            "CHK": "dflex_ky_3_1",
            "PK": "dflex_ky_2_2",
            "SK": "dflex_sk_1_NaN",
          },
          "order": {
            "parent": NaN,
            "self": 0,
          },
        }
      `);
    });
  });
});
