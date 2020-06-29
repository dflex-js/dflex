import createElement from "dflex-utils-test";

import Base from "../src";
import store from "../../Store";

const childInstance1 = createElement();
const childInstance2 = createElement();

childInstance1.depth = 0;
childInstance2.depth = 0;

const parentInstance = createElement({
  children: [childInstance1.element, childInstance2.element],
});
parentInstance.depth = 1;

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);

  store.register(parentInstance);
});

let base;

describe("DND - PKG: Base", () => {
  beforeAll(() => {
    const START_CLIENT_X = 10;
    const START_CLIENT_Y = 20;

    base = new Base(childInstance1.id, {
      x: START_CLIENT_X,
      y: START_CLIENT_Y,
    });
  });

  it("Checks node siblings", () => {
    expect(base.isSingleton).toBe(false);
  });

  it("Checks node parent", () => {
    expect(base.isOrphan).toBe(false);
  });
});
