import store from "../../src/DnDStore";

import { assignDraggable } from "./utils";

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

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);

  store.register(parentInstance);
});

let draggable;

describe("Testing isDraggedOut()", () => {
  beforeEach(() => {
    draggable = assignDraggable(childInstance2);
  });

  afterEach(() => {
    draggable.endDragging();
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

    for (let i = 0; i < Math.abs(MOVING_PIXELS) + 2; i += 1) {
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

  afterAll(() => {
    draggable.endDragging();
  });
});
