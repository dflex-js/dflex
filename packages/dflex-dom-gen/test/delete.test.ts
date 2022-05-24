import Generator, { Pointer } from "../src";

const domGen = new Generator();

let pointerChild0D0: Pointer;
let pointerChild1D0: Pointer;

const KEYS_CHILDREN_D0 = {
  CHK: null,
  PK: "1-0",
  SK: "0-0",
};

describe("Testing clear methods", () => {
  beforeAll(() => {
    // DOM-root
    // │
    // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
    // │
    // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

    pointerChild0D0 = domGen.register("id-0", 0);
    pointerChild1D0 = domGen.register("id-1", 0);
  });

  it("Generates two pointers correctly", () => {
    expect(pointerChild0D0).toStrictEqual({
      keys: KEYS_CHILDREN_D0,
      order: {
        parent: 0,
        self: 0,
      },
    });

    expect(pointerChild1D0).toStrictEqual({
      keys: KEYS_CHILDREN_D0,
      order: {
        parent: 0,
        self: 1,
      },
    });
  });

  it("The new generated branch has correct registered ids", () => {
    const branch = domGen.getElmBranch(pointerChild0D0.keys.SK);

    expect(branch).toStrictEqual(["id-0", "id-1"]);
  });

  it("The new generated branch has its key inside the branch depth array", () => {
    expect(domGen.branchesByDepth).toMatchInlineSnapshot(`
      Object {
        "0": Array [
          "0-0",
        ],
      }
    `);
  });

  it("Remove the first siblings", () => {
    const elmID = domGen.removeElementIDFromBranch(KEYS_CHILDREN_D0.SK, 0);

    expect(elmID).toBe("id-0");
  });

  it("Siblings branch removed the deleted element id", () => {
    const branch = domGen.getElmBranch(pointerChild0D0.keys.SK);

    expect(branch).toStrictEqual(["id-1"]);
  });

  it("The branch depth array still has the branch key", () => {
    expect(domGen.branchesByDepth).toMatchInlineSnapshot(`
      Object {
        "0": Array [
          "0-0",
        ],
      }
    `);
  });

  it("Add new element after deleting the old one to check indicators working correctly", () => {
    pointerChild0D0 = domGen.register("id-0", 0);

    expect(pointerChild0D0).toStrictEqual({
      keys: KEYS_CHILDREN_D0,
      order: {
        parent: 0,
        self: 1,
      },
    });

    const branch = domGen.getElmBranch(pointerChild0D0.keys.SK);

    expect(branch).toStrictEqual(["id-1", "id-0"]);

    expect(domGen.branchesByDepth).toMatchInlineSnapshot(`
      Object {
        "0": Array [
          "0-0",
        ],
      }
    `);
  });

  it("Destroy branch", () => {
    domGen.destroyBranch(KEYS_CHILDREN_D0.SK, () => {});

    const branch = domGen.getElmBranch(pointerChild0D0.keys.SK);

    expect(branch).toBeUndefined();
    expect(domGen.branchesByDepth).toMatchInlineSnapshot(`Object {}`);
  });

  it("Adds two siblings again", () => {
    // DOM-root
    // │
    // │───id-0  => (order:{parent: 0, self: 0 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})
    // │
    // │───id-1  => (order:{parent: 0, self: 1 }) || (keys: {CHK: null,PK: "1-0",SK: "0-0"})

    pointerChild0D0 = domGen.register("id-0", 0);
    pointerChild1D0 = domGen.register("id-1", 0);

    expect(pointerChild0D0).toStrictEqual({
      keys: KEYS_CHILDREN_D0,
      order: {
        parent: 0,
        self: 0,
      },
    });

    expect(pointerChild1D0).toStrictEqual({
      keys: KEYS_CHILDREN_D0,
      order: {
        parent: 0,
        self: 1,
      },
    });

    const branch = domGen.getElmBranch(pointerChild0D0.keys.SK);

    expect(branch).toStrictEqual(["id-0", "id-1"]);

    expect(domGen.branchesByDepth).toMatchInlineSnapshot(`
      Object {
        "0": Array [
          "0-0",
        ],
      }
    `);
  });
});
