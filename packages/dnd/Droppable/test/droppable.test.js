import store from "@dflex/dnd-store";

import {
  childInstance1,
  childInstance2,
  parentInstance,
} from "dflex-utils-test/instances";

import { assignDraggable } from "@dflex/dnd-draggable/test/utils";

import Droppable from "../src/Droppable";

let draggable;

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);
  store.register(parentInstance);

  draggable = assignDraggable(childInstance1);
});

describe("Testing Droppable", () => {
  test("should ", () => {
    expect(true).toBe(true);
  });
});
