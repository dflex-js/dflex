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

const START_CLIENT_X = 10;
const START_CLIENT_Y = 20;

let innerXOffset;
let innerYOffset;
describe("DND - PKG: Draggable", () => {
  beforeAll(() => {
    draggable = new Draggable(childInstance1.id, {
      x: START_CLIENT_X,
      y: START_CLIENT_Y,
    });
  });

  it("Checks if dragged is last element in the list", () => {
    expect(draggable.isDraggedLastElm()).toEqual(false);
  });

  it("Current offset is equal to initial offset", () => {
    expect(draggable[DRAGGED_ELM].offset.top).toEqual(
      draggable[DRAGGED_ELM].currentTop
    );
    expect(draggable[DRAGGED_ELM].offset.left).toEqual(
      draggable[DRAGGED_ELM].currentLeft
    );
  });

  it("Calculated inner offset", () => {
    innerXOffset = draggable.innerXOffset;
    innerYOffset = draggable.innerYOffset;

    expect(innerXOffset).toBeTruthy();
    expect(innerYOffset).toBeTruthy();
  });

  it("Current offset isn't equal to initial offset after element dragged", () => {
    const MOVING_PIXELS = 100;
    for (let i = 0; i < MOVING_PIXELS; i += 1) {
      draggable.dragAt(START_CLIENT_X + i, START_CLIENT_Y + i);
    }

    draggable.endDragging();

    expect(draggable[DRAGGED_ELM].offset.top).not.toBe(
      draggable[DRAGGED_ELM].currentTop
    );
    expect(draggable[DRAGGED_ELM].offset.left).not.toBe(
      draggable[DRAGGED_ELM].currentLeft
    );
  });

  it("Current offset is set correctly", () => {
    expect(draggable[DRAGGED_ELM].currentTop).toEqual(
      draggable[DRAGGED_ELM].offset.top + draggable[DRAGGED_ELM].translateX
    );

    expect(draggable[DRAGGED_ELM].currentLeft).toEqual(
      draggable[DRAGGED_ELM].offset.left + draggable[DRAGGED_ELM].translateY
    );
  });

  it("Makes sure inner offset not changed after drag", () => {
    expect(draggable.innerXOffset).toEqual(innerXOffset);
    expect(draggable.innerYOffset).toEqual(innerYOffset);
  });

  describe("Testing is out", () => {
    beforeAll(() => {
      draggable = new Draggable(childInstance2.id, {
        x: childInstance2.element.getBoundingClientRect().left,
        y: childInstance2.element.getBoundingClientRect().top,
      });
    });

    it("Checks if dragged is last element in the list", () => {
      expect(draggable.isDraggedLastElm()).toEqual(true);
    });

    it("Goes out from the right", () => {
      const MOVING_PIXELS = draggable.thresholds.dragged.maxRight;

      for (let i = 0; i < MOVING_PIXELS + 2; i += 1) {
        draggable.dragAt(i, 0);
      }

      expect(draggable.isDraggedOut()).toBe(true);
    });

    it("Goes out from the left", () => {
      const MOVING_PIXELS = draggable.thresholds.dragged.maxLeft;

      for (let i = 0; i < MOVING_PIXELS + 2; i += 1) {
        draggable.dragAt(-i, 0);
      }

      expect(draggable.isDraggedOut()).toBe(true);
    });

    it("Goes out from the top", () => {
      const MOVING_PIXELS = draggable.thresholds.dragged.maxTop;

      for (let i = 0; i < Math.abs(MOVING_PIXELS) + 2; i += 1) {
        draggable.dragAt(0, -i);
      }

      expect(draggable.isDraggedOut()).toBe(true);
    });

    it("Goes out from the bottom", () => {
      const MOVING_PIXELS = draggable.thresholds.dragged.maxBottom;

      for (let i = 0; i < MOVING_PIXELS + 2; i += 1) {
        draggable.dragAt(0, i);
      }

      expect(draggable.isDraggedOut()).toBe(true);
    });
  });
});
