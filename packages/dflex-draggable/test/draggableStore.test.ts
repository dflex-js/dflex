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
});
