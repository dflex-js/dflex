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
    // Why this is an error? Do you know why? If so, there's a PR waiting for you.
    // @ts-expect-error
    expect(store.registry).toBeTruthy();
  });

  it("Registers element and initiates translateX,Y", () => {
    // @ts-expect-error
    expect(store.registry).toMatchSnapshot();
  });
});
