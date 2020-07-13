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

let switchElement;
let isDraggedLeavingFromBottom;
let isDraggedLeavingFromTop;
let isDraggedOut;

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);
  store.register(parentInstance);

  draggable = assignDraggable(childInstance1);
});

describe("Testing Droppable", () => {
  beforeAll(() => {
    droppable = new Droppable(draggable);

    switchElement = jest.spyOn(droppable, "switchElement");
    isDraggedLeavingFromBottom = jest.spyOn(
      draggable,
      "isDraggedLeavingFromBottom"
    );
    isDraggedLeavingFromTop = jest.spyOn(draggable, "isDraggedLeavingFromTop");
    isDraggedOut = jest.spyOn(draggable, "isDraggedOut");
  });

  afterAll(() => {
    droppable.endDragging();

    switchElement.mockRestore();
    isDraggedLeavingFromBottom.mockRestore();
    isDraggedLeavingFromTop.mockRestore();
    isDraggedOut.mockRestore();
  });

  // describe("Goes out from the right", () => {
  //   beforeAll(() => {
  //     const MOVING_PIXELS = draggable.thresholds.dragged.maxRight;

  //     // Goes out from the right
  //     for (let i = 0; i < MOVING_PIXELS + 2; i += 1) {
  //       droppable.dragAt(i, 0);
  //     }
  //   });

  //   test("Returns isDraggedOut true", () => {
  //     expect(droppable.draggable.isDraggedOut()).toBe(true);
  //   });

  //   test("Returns isDraggedLeavingFromTop false", () => {
  //     expect(droppable.draggable.isDraggedLeavingFromTop()).toBe(false);
  //   });

  //   test("Returns isDraggedLeavingFromBottom false", () => {
  //     expect(droppable.draggable.isDraggedLeavingFromBottom()).toBe(false);
  //   });

  //   test("Calls switchElement", () => {
  //     expect(switchElement).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe("Goes out from the left", () => {
  //   beforeAll(() => {
  //     const MOVING_PIXELS = draggable.thresholds.dragged.maxLeft;

  //     for (let i = 0; i < Math.abs(MOVING_PIXELS) + 2; i += 1) {
  //       droppable.dragAt(i, 0);
  //     }
  //   });

  //   test("Calls isDraggedOut", () => {
  //     expect(isDraggedOut).toHaveReturnedWith(true);
  //   });

  //   test("Calls isDraggedLeavingFromTop once", () => {
  //     expect(isDraggedLeavingFromTop).toHaveReturnedWith(false);
  //   });

  //   test("Doesn't call isDraggedLeavingFromBottom", () => {
  //     expect(isDraggedLeavingFromBottom).toHaveReturnedWith(false);
  //   });

  //   test("Calls switchElement one time", () => {
  //     expect(switchElement).toHaveBeenNthCalledWith(1, true);
  //   });
  // });

  describe("Goes out from the top", () => {
    beforeAll(() => {
      const MOVING_PIXELS = draggable.thresholds.dragged.maxTop;

      for (let i = 0; i < Math.abs(MOVING_PIXELS) + 2; i += 1) {
        droppable.dragAt(0, -i);
      }
    });

    test("Calls isDraggedOut", () => {
      expect(isDraggedOut).toHaveReturnedWith(true);
    });

    test("Calls isDraggedLeavingFromTop once", () => {
      expect(isDraggedLeavingFromTop).toHaveNthReturnedWith(1, true);
    });

    test("Doesn't call isDraggedLeavingFromBottom", () => {
      expect(isDraggedLeavingFromBottom).toHaveBeenCalledTimes(0);
    });

    test("Calls switchElement one time", () => {
      expect(switchElement).toHaveBeenNthCalledWith(1, false);
    });
  });
});
