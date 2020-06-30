import { createElement } from "dflex-utils-test";
import { DRAGGED_ELM } from "@dflex/draggable/constants.json";

import Base from "../src";
import store from "../../Store";

// eslint-disable-next-line no-underscore-dangle
function getBoundingClientRect() {
  return {
    x: 851.671875,
    y: 200.046875,
    width: 8.34375,
    height: 17,
    top: 967.046875,
    right: 860.015625,
    bottom: 984.046875,
    left: 851.671875,
  };
}

const childInstance1 = createElement({ getBoundingClientRect });
const childInstance2 = createElement({ getBoundingClientRect });

const parentInstance = createElement({
  children: [childInstance1.element, childInstance2.element],
  getBoundingClientRect,
});

childInstance1.depth = 0;
childInstance2.depth = 0;
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

  it("Checks parent list", () => {
    expect(base.parentsList).toBe(parentInstance.id);
  });

  it("Checks siblings list", () => {
    expect(base.siblingsList).toStrictEqual([
      childInstance1.id,
      childInstance2.id,
    ]);
  });

  it("Detects activeParent", () => {
    expect(base.activeParent.id).toBe(parentInstance.id);
  });

  it("Detects activeParent2", () => {
    expect(base[DRAGGED_ELM].thresholdOffset).toStrictEqual({
      horizontal: 0,
      vertical: 0,
    });
  });
});
