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

// TODO:
// Add tests to cover passing custom element instance with class?
// If you are interested open PR!

describe("Testing Store Package", () => {
  beforeAll(() => {
    store.register(elm0D0);
    store.register(elm1D0);
    store.register(elm2D0);

    store.register(elm0D1);
  });

  it("Registers new elements", () => {
    expect(store.DOMGen.branches).toStrictEqual({
      "0-0": ["id-0", "id-1", "id-2"],
      "1-0": "p-id-0",
    });
  });

  it("Snaps shot registry", () => {
    expect(store.registry).toMatchSnapshot();
  });

  it("Returns element instance by element id", () => {
    const elemInstance = store.registry[elm0D0.id];

    expect(elemInstance).toStrictEqual({
      id: "id-0",
      depth: 0,
      keys: {
        CHK: null,
        PK: "1-0",
        SK: "0-0",
      },
      order: {
        parent: 0,
        self: 0,
      },
      ref,
    });
  });

  it("Returns element branch", () => {
    const elemInstance = store.registry[elm0D0.id];

    const elemBranch = store.getElmBranchByKey(elemInstance.keys.SK);

    expect(elemBranch).toStrictEqual(["id-0", "id-1", "id-2"]);
  });

  it("Snaps shot registry after delete", () => {
    expect(store.registry).toMatchSnapshot();
  });
});
