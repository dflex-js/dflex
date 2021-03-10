import store from "../../src/DnDStore";
import Droppable from "../../src/Droppable";
import { assignDraggable } from "../utils";

const ref = document.createElement("div");

const childInstance1 = {
  id: "id-0",
  depth: 0,
  ref,
};

const childInstance2 = {
  id: "id-1",
  depth: 0,
  ref,
};

const parentInstance = {
  id: "id-p-0",
  depth: 1,
  ref,
};

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
