import { store } from "../../src";

import {
  childInstance1,
  childInstance2,
  parentInstance,
  assignDraggable,
} from "./utils";

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);

  store.register(parentInstance);
});

let draggable;

describe("Testing flags and functionalities related", () => {
  describe("Testing isDraggedLastElm()", () => {
    it("Checks first element correctly", () => {
      draggable = assignDraggable(childInstance1);
      expect(draggable.isDraggedLastElm()).toBe(false);
      draggable.endDragging();
    });

    it("Checks last element correctly", () => {
      draggable = assignDraggable(childInstance2);
      expect(draggable.isDraggedLastElm()).toBe(true);
      draggable.endDragging();
    });

    it("Checks singleton element correctly", () => {
      draggable = assignDraggable(parentInstance);
      expect(draggable.isDraggedLastElm()).toBe(true);
      draggable.endDragging();
    });
  });

  describe("Testing isDraggedFirstElm()", () => {
    it("Checks first element correctly", () => {
      draggable = assignDraggable(childInstance1);
      expect(draggable.isDraggedFirstElm()).toBe(true);
      draggable.endDragging();
    });

    it("Checks last element correctly", () => {
      draggable = assignDraggable(childInstance2);
      expect(draggable.isDraggedFirstElm()).toBe(false);
      draggable.endDragging();
    });

    it("Checks singleton element correctly", () => {
      draggable = assignDraggable(parentInstance);
      expect(draggable.isDraggedFirstElm()).toBe(true);
      draggable.endDragging();
    });
  });
});
