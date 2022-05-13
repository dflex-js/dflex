import store from "../../src/DnDStore";

import { elm1 } from "../__mocks__/DOMElements";

describe("DnD Store", () => {
  beforeAll(() => {
    store.register(elm1);
  });

  it("Element is initiated", () => {
    store.register(elm1);
    expect(store.registry).toMatchSnapshot();
  });

  it("Returns element branch and parent", () => {
    const { branches, parent } = store.getElmTreeById(elm1.id);

    expect(branches).toMatchInlineSnapshot(`
      Object {
        "parents": undefined,
        "siblings": Array [
          "id-1",
        ],
      }
    `);

    expect(parent).toMatchInlineSnapshot(`null`);
  });

  // it("Registers more elements in the store all in the same level (depth=0)", () => {
  //   store.register(elm2);
  //   store.register(elm3);
  //   store.register(elm4);
  // });
});
