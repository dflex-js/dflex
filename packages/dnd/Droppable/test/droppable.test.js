import store from "@dflex/dnd-store";

import {
  childInstance1,
  childInstance2,
  parentInstance,
} from "dflex-utils-test/instances";

import { assignDraggable } from "@dflex/dnd-draggable/test/utils";

import Droppable from "../src/Droppable";

let draggable;
let droppable;

let spy;

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);
  store.register(parentInstance);

  draggable = assignDraggable(childInstance1);
});

describe("Testing Droppable", () => {
  beforeAll(() => {
    droppable = new Droppable(draggable);
    spy = jest.spyOn(droppable, "switchElement");

    const MOVING_PIXELS = draggable.thresholds.dragged.maxRight;

    // Goes out from the right
    for (let i = 0; i < MOVING_PIXELS + 2; i += 1) {
      droppable.dragAt(i, 0);
    }
  });

  test("Returns isDraggedOut true", () => {
    expect(droppable.draggable.isDraggedOut()).toBe(true);
  });

  test("Returns isDraggedLeavingFromTop false", () => {
    expect(droppable.draggable.isDraggedLeavingFromTop()).toBe(false);
  });

  test("Returns isDraggedLeavingFromBottom false", () => {
    expect(droppable.draggable.isDraggedLeavingFromBottom()).toBe(false);
  });

  test("Calls switchElement", () => {
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
