import store from "../../src/DnDStore";

console.log("file: dndStore.test.ts ~ line 2 ~ store", store);

const ref = document.createElement("div");

const elm0D0 = {
  id: "id-0",
  depth: 0,
  ref,
};

describe("DnD Store", () => {
  beforeAll(() => {
    store.register(elm0D0);
  });

  it("Element is initiated", () => {
    expect(store.registry).toMatchSnapshot();
  });

  it("Returns all element connections and instance", () => {
    const elemInstance = store.getElmTreeById(elm0D0.id);

    expect(elemInstance).toMatchSnapshot();
  });
});
