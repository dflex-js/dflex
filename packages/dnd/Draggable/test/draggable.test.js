import { createElement, getBoundingClientRect } from "dflex-utils-test";
import { DRAGGED_ELM } from "@dflex/draggable/constants.json";

import Draggable from "../src";
import store from "../../Store";

const childInstance1 = createElement({ getBoundingClientRect });
childInstance1.depth = 0;

const childInstance2 = createElement({ getBoundingClientRect });
childInstance2.depth = 0;

const parentInstance = createElement({
  children: [childInstance1.element, childInstance2.element],
  getBoundingClientRect,
});
parentInstance.depth = 1;

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);

  store.register(parentInstance);
});

let draggable;

describe("DND - PKG: Draggable", () => {
  beforeAll(() => {
    const START_CLIENT_X = 10;
    const START_CLIENT_Y = 20;

    draggable = new Draggable(childInstance1.id, {
      x: START_CLIENT_X,
      y: START_CLIENT_Y,
    });
  });

  it("Check if dragged is last element in the list", () => {
    expect(draggable.isDraggedLastElm()).toEqual(false);
  });
});
