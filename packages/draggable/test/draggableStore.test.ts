import { store } from "../src";

const ref = document.createElement("div");

const elm0D0 = {
  id: "id-0",
  depth: 0,
  ref,
};

describe("Draggable Store", () => {
  beforeAll(() => {
    store.register(elm0D0);
  });

  it("Registry is not empty", () => {
    expect(store.registry).toBeTruthy();
  });

  it("Registers element and initiates translateX,Y", () => {
    expect(store.registry).toMatchSnapshot();
  });

  // it("Returns all element connections and instance", () => {
  //   const elemInstance = store.getElmTreeById(elm0D0.id);

  //   expect(elemInstance).toStrictEqual({
  //     element: {
  //       id: "id-0",
  //       depth: 0,
  //       moreInfo: "I am the first child",
  //       order: { self: 0, parent: 0 },
  //       keys: { sK: "0-0", pK: "1-0", chK: null },
  //     },
  //     parent: {
  //       depth: 1,
  //       id: "p-id-0",
  //       keys: {
  //         chK: "0-0",
  //         pK: "2-0",
  //         sK: "1-0",
  //       },
  //       moreInfo: "I am parent",
  //       order: {
  //         parent: 0,
  //         self: 0,
  //       },
  //     },
  //     branches: { siblings: ["id-0", "id-1", "id-2"], parents: "p-id-0" },
  //   });
  // });
});
