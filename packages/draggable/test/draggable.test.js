/* eslint-disable no-plusplus */

import { Draggable, store } from "../src";

let idCounter = 0;

function addElement() {
  const newDiv = document.createElement("div");

  const id = `id-${idCounter++}`;

  newDiv.setAttribute("id", id);

  const newContent = document.createTextNode("Hello!");
  newDiv.appendChild(newContent);

  return { element: newDiv, id };
}

const elmInstance1 = addElement();
const elmInstance2 = addElement();

store.register(elmInstance1);
store.register(elmInstance2);

describe("Draggable Store", () => {
  it("Registry is not empty", () => {
    expect(store.registry).toBeTruthy();
  });

  it("Registers element and initiates translateX,Y", () => {
    const result = {
      [elmInstance1.id]: {
        element: elmInstance1.element,
        id: elmInstance1.id,
        translateX: 0,
        translateY: 0,
      },

      [elmInstance2.id]: {
        element: elmInstance2.element,
        id: elmInstance2.id,
        translateX: 0,
        translateY: 0,
      },
    };

    expect(store.registry).toEqual(result);
  });
});

describe("Draggable mechanism", () => {
  describe("FIRST ROUND", () => {
    let EXPECTED_TRANSLATE_X_R1;
    let EXPECTED_TRANSLATE_Y_R1;

    const START_CLIENT_X_R1 = 10;
    const START_CLIENT_Y_R1 = 20;

    let EXPECTED_OFFSET_X_R1;
    let EXPECTED_OFFSET_Y_R1;

    const MOVING_PIXELS_R1 = 50;

    let draggable;

    beforeAll(() => {
      EXPECTED_TRANSLATE_X_R1 = store.registry[elmInstance1.id].translateX;
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
        expect(draggable.offsetX).toEqual(EXPECTED_OFFSET_X_R1);
        expect(draggable.offsetY).toEqual(EXPECTED_OFFSET_Y_R1);
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
        expect(draggable.offsetX).toEqual(EXPECTED_OFFSET_X_R1);
        expect(draggable.offsetY).toEqual(EXPECTED_OFFSET_Y_R1);
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
        draggable.end();
      });

      it("Updates style to normal", () => {
        expect(draggable.draggedStyle.pointerEvents).toBe("");
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
      EXPECTED_TRANSLATE_X_R2 = store.registry[elmInstance1.id].translateX;
      EXPECTED_TRANSLATE_Y_R2 = store.registry[elmInstance1.id].translateY;

      EXPECTED_OFFSET_X_R2 = -START_CLIENT_X_R2 + EXPECTED_TRANSLATE_X_R2;
      EXPECTED_OFFSET_Y_R2 = -START_CLIENT_Y_R2 + EXPECTED_TRANSLATE_Y_R2;

      draggable = new Draggable(elmInstance1.id, {
        x: START_CLIENT_X_R2,
        y: START_CLIENT_Y_R2,
      });
    });

    describe("Stimulates mousedown click - Inits draggable", () => {
      it("TranslateX/Y are zeros", () => {
        console.log(">>", store.registry[elmInstance1.id].translateX);
        expect(EXPECTED_TRANSLATE_X_R2).toEqual(0);
        expect(EXPECTED_TRANSLATE_Y_R2).toEqual(0);
      });

      it.skip("matches values in draggable with those in store", () => {
        expect(draggable.draggedElm.translateX).toEqual(
          EXPECTED_TRANSLATE_X_R2
        );
        expect(draggable.draggedElm.translateY).toEqual(
          EXPECTED_TRANSLATE_Y_R2
        );
      });

      it.skip("Calculates offset", () => {
        expect(draggable.offsetX).toEqual(EXPECTED_OFFSET_X_R2);
        expect(draggable.offsetY).toEqual(EXPECTED_OFFSET_Y_R2);
      });
    });

    describe.skip("Stimulates mousemove - Checks dragAt()", () => {
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
        expect(draggable.offsetX).toEqual(EXPECTED_OFFSET_X_R2);
        expect(draggable.offsetY).toEqual(EXPECTED_OFFSET_Y_R2);
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

    describe.skip("Stimulates mouseup - Checks end()", () => {
      beforeAll(() => {
        draggable.end();
      });

      it("Updates style to normal", () => {
        expect(draggable.draggedStyle.pointerEvents).toBe("");
      });
    });
  });
});
