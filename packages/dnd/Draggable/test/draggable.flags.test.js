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
});
