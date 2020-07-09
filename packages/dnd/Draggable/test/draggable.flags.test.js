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
  describe("Testing updateDraggedDirectionFlags()", () => {
    beforeAll(() => {
      draggable = assignDraggable(childInstance1);
    });

    it("Updates dragged direction flags correctly when Y is increased/moving down", () => {
      const { prevY } = draggable;
      const clickY = prevY + 10;

      draggable.updateDraggedDirectionFlags(clickY);

      expect(draggable.isMovingDown).toBe(true);
      expect(draggable.prevY).toEqual(clickY);
      expect(draggable.elemDirection).toEqual(-1);
    });

    it("Updates dragged direction flags correctly when Y is decreased/moving up", () => {
      const { prevY } = draggable;
      const clickY = prevY - 10;

      expect(draggable.isMovingDownPrev).toBe(true);

      draggable.updateDraggedDirectionFlags(clickY);

      expect(draggable.isMovingDown).toBe(false);
      expect(draggable.prevY).toEqual(clickY);
      expect(draggable.elemDirection).toEqual(1);
    });

    it("Updates dragged direction flags correctly when Y continues decreasing/moving up", () => {
      const { prevY } = draggable;
      const clickY = prevY - 10;

      expect(draggable.isMovingDownPrev).toBe(false);

      draggable.updateDraggedDirectionFlags(clickY);

      expect(draggable.isMovingDown).toBe(false);
      expect(draggable.prevY).toEqual(clickY);
      expect(draggable.elemDirection).toEqual(1);
    });

    afterAll(() => {
      draggable.endDragging();
    });
  });

  describe("Testing isDraggedLastElm()", () => {
    afterEach(() => {
      draggable.endDragging();
    });

    it("Checks first element correctly", () => {
      draggable = assignDraggable(childInstance1);
      expect(draggable.isDraggedLastElm()).toBe(false);
    });

    it("Checks last element correctly", () => {
      draggable = assignDraggable(childInstance2);
      expect(draggable.isDraggedLastElm()).toBe(true);
    });

    it("Checks singleton element correctly", () => {
      draggable = assignDraggable(parentInstance);
      expect(draggable.isDraggedLastElm()).toBe(true);
    });
  });

  describe("Testing isDraggedFirstElm()", () => {
    afterEach(() => {
      draggable.endDragging();
    });

    it("Checks first element correctly", () => {
      draggable = assignDraggable(childInstance1);
      expect(draggable.isDraggedFirstElm()).toBe(true);
    });

    it("Checks last element correctly", () => {
      draggable = assignDraggable(childInstance2);
      expect(draggable.isDraggedFirstElm()).toBe(false);
    });

    it("Checks singleton element correctly", () => {
      draggable = assignDraggable(parentInstance);
      expect(draggable.isDraggedFirstElm()).toBe(true);
    });
  });

  describe("Testing isDraggedHasNoEffect()", () => {
    afterEach(() => {
      draggable.endDragging();
    });

    describe("Testing first child", () => {
      it("Dragged has no effect on list when it is going up", () => {
        draggable = assignDraggable(childInstance1);
        draggable.isMovingDown = false;

        expect(draggable.isDraggedHasNoEffect()).toBe(false);
      });

      // TODO: FIX IT
      it("Dragged has an effect on list when it is going down", () => {
        draggable = assignDraggable(childInstance1);
        draggable.isMovingDown = true;

        expect(draggable.isDraggedHasNoEffect()).toBe(true);
      });
    });

    describe("Testing singleton", () => {
      it("Dragged has no effect on list when it is going down", () => {
        draggable = assignDraggable(parentInstance);
        draggable.isMovingDown = true;

        expect(draggable.isDraggedHasNoEffect()).toBe(true);
      });

      it("Dragged has no effect on list when it is going up", () => {
        draggable = assignDraggable(parentInstance);
        draggable.isMovingDown = false;

        expect(draggable.isDraggedHasNoEffect()).toBe(true);
      });
    });
  });
});
