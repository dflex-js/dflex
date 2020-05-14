import Generator from "../src/Generator";

const domGen = new Generator();

describe("DOM Relationship Generator", () => {
  it("works with all element from the same depth", () => {
    let pointer;

    const expectedKeys = {
      chK: null,
      pK: "1-0",
      sK: "0-0",
    };

    pointer = domGen.getElmRelations("id-0", 0);

    expect(pointer).toStrictEqual({
      keys: expectedKeys,
      order: {
        parent: 0,
        self: 0,
      },
    });

    pointer = domGen.getElmRelations("id-1", 0);

    expect(pointer).toStrictEqual({
      keys: expectedKeys,
      order: {
        parent: 0,
        self: 1,
      },
    });

    pointer = domGen.getElmRelations("id-2", 0);

    expect(pointer).toStrictEqual({
      keys: expectedKeys,
      order: {
        parent: 0,
        self: 2,
      },
    });
  });

  // todo: fix this
  it("Adds the same element twice should returns the same old value", () => {
    const expectedKeys = {
      chK: null,
      pK: "1-0",
      sK: "0-0",
    };

    const pointer = domGen.getElmRelations("id-2", 0);

    expect(pointer).toStrictEqual({
      keys: expectedKeys,
      order: {
        parent: 0,
        self: 2,
      },
    });
  });
});
