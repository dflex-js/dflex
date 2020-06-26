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

describe("Draggable Store", () => {
  it("Has empty registry", () => {
    expect(store.registry).toStrictEqual({});
  });

  it("Registers element and initiates translateX,Y", () => {
    store.register(elmInstance1);
    store.register(elmInstance2);

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
    let EXPECTED_TRANSLATE_X = 0;
    let EXPECTED_TRANSLATE_Y = 0;

    const START_CLIENT_X = 10;
    const START_CLIENT_Y = 20;

    const EXPECTED_OFFSET_X = -START_CLIENT_X + EXPECTED_TRANSLATE_X;
    const EXPECTED_OFFSET_Y = -START_CLIENT_Y + EXPECTED_TRANSLATE_Y;

    const MOVING_PIXELS = 50;

    let draggable;

    beforeAll(() => {
      draggable = new Draggable(elmInstance1.id, {
        x: START_CLIENT_X,
        y: START_CLIENT_Y,
      });
    });

    describe("Stimulates mousedown click - Inits draggable", () => {
      it("Initiates translateX/Y", () => {
        expect(draggable.draggedElm.translateX).toEqual(EXPECTED_TRANSLATE_X);
        expect(draggable.draggedElm.translateY).toEqual(EXPECTED_TRANSLATE_Y);
      });

      it("Calculates offset", () => {
        expect(draggable.offsetX).toEqual(EXPECTED_OFFSET_X);
        expect(draggable.offsetY).toEqual(EXPECTED_OFFSET_Y);
      });
    });

    describe("Stimulates mousemove - Checks dragAt()", () => {
      beforeAll(() => {
        for (let i = 0; i < MOVING_PIXELS; i += 1) {
          draggable.dragAt(START_CLIENT_X + i, START_CLIENT_Y + i);

          EXPECTED_TRANSLATE_X = START_CLIENT_X + i + EXPECTED_OFFSET_X;
          EXPECTED_TRANSLATE_Y = START_CLIENT_Y + i + EXPECTED_OFFSET_Y;
        }
      });

      it("Offset never change", () => {
        expect(draggable.offsetX).toEqual(EXPECTED_OFFSET_X);
        expect(draggable.offsetY).toEqual(EXPECTED_OFFSET_Y);
      });

      it("Draggable updates translateX/Y in store", () => {
        expect(draggable.draggedElm.translateX).toEqual(EXPECTED_TRANSLATE_X);
        expect(draggable.draggedElm.translateY).toEqual(EXPECTED_TRANSLATE_Y);
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
    const EXPECTED_TRANSLATE_X = 0;
    const EXPECTED_TRANSLATE_Y = 0;

    const START_CLIENT_X = 10;
    const START_CLIENT_Y = 20;

    const EXPECTED_OFFSET_X = -START_CLIENT_X + EXPECTED_TRANSLATE_X;
    const EXPECTED_OFFSET_Y = -START_CLIENT_Y + EXPECTED_TRANSLATE_Y;

    const MOVING_PIXELS = 50;

    let draggable;

    beforeAll(() => {
      draggable = new Draggable(elmInstance1.id, {
        x: START_CLIENT_X,
        y: START_CLIENT_Y,
      });
    });

    describe("Stimulates mousedown click - Inits draggable", () => {
      it("Initiates translateX/Y", () => {
        // expect(draggable.draggedElm.translateX).toEqual(EXPECTED_TRANSLATE_X);
        // expect(draggable.draggedElm.translateY).toEqual(EXPECTED_TRANSLATE_Y);
      });
      it("Calculates offset", () => {
        // expect(draggable.offsetX).toEqual(EXPECTED_OFFSET_X);
        // expect(draggable.offsetY).toEqual(EXPECTED_OFFSET_Y);
      });
    });

    describe("Stimulates mousemove - Checks dragAt()", () => {
      // beforeAll(() => {
      //   for (let i = 0; i < MOVING_PIXELS; i += 1) {
      //     draggable.dragAt(START_CLIENT_X + i, START_CLIENT_Y + i);
      //     EXPECTED_TRANSLATE_X = START_CLIENT_X + i + EXPECTED_OFFSET_X;
      //     EXPECTED_TRANSLATE_Y = START_CLIENT_Y + i + EXPECTED_OFFSET_Y;
      //   }
      // });
      // it("Offset never change", () => {
      //   expect(draggable.offsetX).toEqual(EXPECTED_OFFSET_X);
      //   expect(draggable.offsetY).toEqual(EXPECTED_OFFSET_Y);
      // });
      // it("Draggable updates translateX/Y in store", () => {
      //   expect(draggable.draggedElm.translateX).toEqual(EXPECTED_TRANSLATE_X);
      //   expect(draggable.draggedElm.translateY).toEqual(EXPECTED_TRANSLATE_Y);
      // });
    });

    describe("Stimulates mouseup - Checks end()", () => {
      // beforeAll(() => {
      //   draggable.end();
      // });
      // it("Updates style to normal", () => {
      //   expect(draggable.draggedStyle.pointerEvents).toBe("");
      // });
    });
  });
});
