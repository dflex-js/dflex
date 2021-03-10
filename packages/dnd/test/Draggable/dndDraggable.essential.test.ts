import {
  childInstance1,
  childInstance2,
  parentInstance,
} from "dflex-utils-test/instances";

import store from "../../DnDStore";
import Draggable from "../Draggable";

const DRAGGED_ELM = "draggedElm";

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);

  store.register(parentInstance);
});

let draggable;

describe("Testing the essentials", () => {
  let innerOffsetX;
  let innerOffsetY;

  const START_CLIENT_X = 10;
  const START_CLIENT_Y = 20;

  beforeAll(() => {
    const elementInstance = store.getElmTreeById(childInstance1.id);

    draggable = new Draggable(elementInstance, {
      x: START_CLIENT_X,
      y: START_CLIENT_Y,
    });
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
    innerOffsetX = draggable.innerOffsetX;
    innerOffsetY = draggable.innerOffsetY;

    expect(innerOffsetX).toBeTruthy();
    expect(innerOffsetY).toBeTruthy();
  });

  it("Current temp offset isn't equal to initial offset after element dragged", () => {
    const MOVING_PIXELS = 100;
    for (let i = 0; i < MOVING_PIXELS; i += 1) {
      draggable.dragAt(START_CLIENT_X + i, START_CLIENT_Y + i);
    }

    // draggable.endDragging();

    expect(draggable[DRAGGED_ELM].offset.top).not.toBe(
      draggable.tempOffset.currentTop
    );

    expect(draggable[DRAGGED_ELM].offset.left).not.toBe(
      draggable.tempOffset.currentLeft
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
    expect(draggable.innerOffsetX).toEqual(innerOffsetX);
    expect(draggable.innerOffsetY).toEqual(innerOffsetY);
  });

  afterAll(() => {
    draggable.endDragging();
  });
});
