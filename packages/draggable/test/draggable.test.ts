import { Draggable, store } from "../src";

const ref = document.createElement("div");

const elmInstance1 = {
  id: "id-0",
  depth: 0,
  ref,
};

store.register(elmInstance1);

describe("Draggable Only Package", () => {
  let EXPECTED_TRANSLATE_X_R1;
  let EXPECTED_TRANSLATE_Y_R1;

  describe("FIRST ROUND", () => {
    const START_CLIENT_X_R1 = 10;
    const START_CLIENT_Y_R1 = 20;

    let EXPECTED_OFFSET_X_R1;
    let EXPECTED_OFFSET_Y_R1;

    const MOVING_PIXELS_R1 = 50;

    let draggable;

    beforeAll(() => {
      // Why this is an error? Do you know why? If so, there's a PR waiting for you.
      // @ts-expect-error
      EXPECTED_TRANSLATE_X_R1 = store.registry[elmInstance1.id].translateX;
      // @ts-expect-error
      EXPECTED_TRANSLATE_Y_R1 = store.registry[elmInstance1.id].translateY;

      EXPECTED_OFFSET_X_R1 = -START_CLIENT_X_R1 + EXPECTED_TRANSLATE_X_R1;
      EXPECTED_OFFSET_Y_R1 = -START_CLIENT_Y_R1 + EXPECTED_TRANSLATE_Y_R1;

      draggable = new Draggable(elmInstance1.id, {
        x: START_CLIENT_X_R1,
        y: START_CLIENT_Y_R1,
      });
    });

    describe("Stimulates mousedown click - Inits draggable", () => {
      it("TranslateX/Y are zeros", () => {
        expect(EXPECTED_TRANSLATE_X_R1).toEqual(0);
        expect(EXPECTED_TRANSLATE_Y_R1).toEqual(0);
      });

      it("matches values in draggable with those in store", () => {
        expect(draggable.draggedElm.translateX).toEqual(
          EXPECTED_TRANSLATE_X_R1
        );
        expect(draggable.draggedElm.translateY).toEqual(
          EXPECTED_TRANSLATE_Y_R1
        );
      });

      it("Calculates offset", () => {
        expect(draggable.outerOffsetX).toEqual(EXPECTED_OFFSET_X_R1);
        expect(draggable.outerOffsetY).toEqual(EXPECTED_OFFSET_Y_R1);
      });
    });

    describe("Stimulates mousemove - Checks dragAt()", () => {
      beforeAll(() => {
        for (let i = 0; i < MOVING_PIXELS_R1; i += 1) {
          draggable.dragAt(START_CLIENT_X_R1 + i, START_CLIENT_Y_R1 + i);

          EXPECTED_TRANSLATE_X_R1 =
            START_CLIENT_X_R1 + i + EXPECTED_OFFSET_X_R1;
          EXPECTED_TRANSLATE_Y_R1 =
            START_CLIENT_Y_R1 + i + EXPECTED_OFFSET_Y_R1;
        }
      });

      it("Offset never change", () => {
        expect(draggable.outerOffsetX).toEqual(EXPECTED_OFFSET_X_R1);
        expect(draggable.outerOffsetY).toEqual(EXPECTED_OFFSET_Y_R1);
      });

      it("Draggable updates translateX/Y in store", () => {
        expect(draggable.draggedElm.translateX).toEqual(
          EXPECTED_TRANSLATE_X_R1
        );
        expect(draggable.draggedElm.translateY).toEqual(
          EXPECTED_TRANSLATE_Y_R1
        );
      });
    });

    describe("Stimulates mouseup - Checks end()", () => {
      beforeAll(() => {
        draggable.endDragging();
      });

      it("Updates style to normal", () => {
        expect(draggable.draggedStyle.pointerEvents).toBe(undefined);
      });
    });
  });

  describe("SECOND ROUND", () => {
    let EXPECTED_TRANSLATE_X_R2;
    let EXPECTED_TRANSLATE_Y_R2;

    const START_CLIENT_X_R2 = 100;
    const START_CLIENT_Y_R2 = 80;

    let EXPECTED_OFFSET_X_R2;
    let EXPECTED_OFFSET_Y_R2;

    const MOVING_PIXELS_R2 = 18;

    let draggable;

    beforeAll(() => {
      // @ts-expect-error
      EXPECTED_TRANSLATE_X_R2 = store.registry[elmInstance1.id].translateX;
      // @ts-expect-error
      EXPECTED_TRANSLATE_Y_R2 = store.registry[elmInstance1.id].translateY;

      EXPECTED_OFFSET_X_R2 = -START_CLIENT_X_R2 + EXPECTED_TRANSLATE_X_R2;
      EXPECTED_OFFSET_Y_R2 = -START_CLIENT_Y_R2 + EXPECTED_TRANSLATE_Y_R2;

      draggable = new Draggable(elmInstance1.id, {
        x: START_CLIENT_X_R2,
        y: START_CLIENT_Y_R2,
      });
    });

    describe("Stimulates mousedown click - Inits draggable", () => {
      it("TranslateX/Y are not zeros", () => {
        expect(EXPECTED_TRANSLATE_X_R2).toBeGreaterThan(0);
        expect(EXPECTED_TRANSLATE_Y_R2).toBeGreaterThan(0);
      });

      it("TranslateX/Y are matching last position", () => {
        expect(EXPECTED_TRANSLATE_X_R2).toEqual(EXPECTED_TRANSLATE_X_R1);
        expect(EXPECTED_TRANSLATE_Y_R2).toEqual(EXPECTED_TRANSLATE_Y_R1);
      });

      it("Calculates offset", () => {
        expect(draggable.outerOffsetX).toEqual(EXPECTED_OFFSET_X_R2);
        expect(draggable.outerOffsetY).toEqual(EXPECTED_OFFSET_Y_R2);
      });
    });

    describe("Stimulates mousemove - Checks dragAt()", () => {
      beforeAll(() => {
        for (let i = 0; i < MOVING_PIXELS_R2; i += 1) {
          draggable.dragAt(START_CLIENT_X_R2 + i, START_CLIENT_Y_R2 + i);

          EXPECTED_TRANSLATE_X_R2 =
            START_CLIENT_X_R2 + i + EXPECTED_OFFSET_X_R2;
          EXPECTED_TRANSLATE_Y_R2 =
            START_CLIENT_Y_R2 + i + EXPECTED_OFFSET_Y_R2;
        }
      });

      it("Offset never change", () => {
        expect(draggable.outerOffsetX).toEqual(EXPECTED_OFFSET_X_R2);
        expect(draggable.outerOffsetY).toEqual(EXPECTED_OFFSET_Y_R2);
      });

      it("Draggable updates translateX/Y in store", () => {
        expect(draggable.draggedElm.translateX).toEqual(
          EXPECTED_TRANSLATE_X_R2
        );
        expect(draggable.draggedElm.translateY).toEqual(
          EXPECTED_TRANSLATE_Y_R2
        );
      });
    });

    describe("Stimulates mouseup - Checks end()", () => {
      beforeAll(() => {
        draggable.endDragging();
      });

      it("Updates style to normal", () => {
        expect(draggable.draggedStyle.pointerEvents).toBe(undefined);
      });
    });
  });
});
