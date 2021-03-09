import Store from "../src";

const store = new Store();

const ref = document.createElement("div");

const elm0D0 = {
  id: "id-0",
  depth: 0,
  ref,
  // moreInfo: "I am the first child",
};
const elm1D0 = {
  id: "id-1",
  depth: 0,
  ref,
  // moreInfo: "I am the first child",
};
const elm2D0 = {
  id: "id-2",
  depth: 0,
  ref,
  // moreInfo: "I am the first child",
};

const elm0D1 = {
  id: "p-id-0",
  depth: 1,
  ref,
  // moreInfo: "I am parent",
};

describe("Testing store", () => {
  it("Registers new elements", () => {
    store.register(elm0D0);
    store.register(elm1D0);
    store.register(elm2D0);

    store.register(elm0D1);

    expect(store.DOMGen.branches).toStrictEqual({
      "0-0": ["id-0", "id-1", "id-2"],
      "1-0": "p-id-0",
    });
  });

  it("Returns element instance by element id", () => {
    const elemInstance = store.getElmById(elm0D0.id);

    expect(elemInstance).toStrictEqual({
      depth: 0,
      id: "id-0",
      keys: {
        chK: null,
        pK: "1-0",
        sK: "0-0",
      },
      order: {
        parent: 0,
        self: 0,
      },
      ref,
    });
  });
});
