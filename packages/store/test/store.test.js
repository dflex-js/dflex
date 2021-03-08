import Store from "../src";

const store = new Store();

const elm0D0 = {
  id: "id-0",
  depth: 0,
  moreInfo: "I am the first child",
};
const elm1D0 = {
  id: "id-1",
  depth: 0,
  moreInfo: "I am the first child",
};
const elm2D0 = {
  id: "id-2",
  depth: 0,
  moreInfo: "I am the first child",
};

const elm0D1 = {
  id: "p-id-0",
  depth: 1,
  moreInfo: "I am parent",
};

describe.only("Testing store", () => {
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
      moreInfo: "I am the first child",
      order: {
        parent: 0,
        self: 0,
      },
    });
  });

  it("Returns all element connections and instance", () => {
    const elemInstance = store.getElmTreeById(elm0D0.id);

    expect(elemInstance).toStrictEqual({
      element: {
        id: "id-0",
        depth: 0,
        moreInfo: "I am the first child",
        order: { self: 0, parent: 0 },
        keys: { sK: "0-0", pK: "1-0", chK: null },
      },
      parent: {
        depth: 1,
        id: "p-id-0",
        keys: {
          chK: "0-0",
          pK: "2-0",
          sK: "1-0",
        },
        moreInfo: "I am parent",
        order: {
          parent: 0,
          self: 0,
        },
      },
      branches: { siblings: ["id-0", "id-1", "id-2"], parents: "p-id-0" },
    });
  });
});
