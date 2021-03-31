import store from "../../src/DnDStore";

import { elm1, elm2, elm3, elm4 } from "../utils";

describe("DnD Store", () => {
  beforeAll(() => {
    store.register(elm1);
    store.register(elm2);
    store.register(elm3);
    store.register(elm4);
  });

  it("Element is initiated", () => {
    expect(store.registry).toMatchSnapshot();
  });

  it("Returns all element connections and instance", () => {
    const elemInstance = store.getElmTreeById(elm1.id);

    expect(elemInstance).toMatchSnapshot();
  });
});
