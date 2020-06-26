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

const clientX = 10;
const clientY = 20;

const movingPixels = 50;

let draggable;

describe("Draggable mechanism", () => {
  beforeAll(() => {
    draggable = new Draggable(elmInstance1.id, { x: clientX, y: clientY });
  });

  describe("FIRST ROUND", () => {
    describe("Stimulates mousedown click - Inits draggable", () => {
      it("Initiates translateX/Y", () => {
        expect(draggable.draggedElm.translateX).toEqual(0);
        expect(draggable.draggedElm.translateY).toEqual(0);
      });

      it("Calculates offset", () => {
        expect(draggable.offsetX).toEqual(-10);
        expect(draggable.offsetY).toEqual(-20);
      });
    });

    describe("Stimulates mousemove - Checks dragAt()", () => {
      beforeAll(() => {
        for (let i = 0; i < movingPixels; i += 1) {
          draggable.dragAt(clientX + i, clientY + i);
        }
      });

      it("Offset never change", () => {
        expect(draggable.offsetX).toEqual(-10);
        expect(draggable.offsetY).toEqual(-20);
      });

      it("Draggable updates translateX/Y in store", () => {
        expect(draggable.draggedElm.translateX).toEqual(0);
        expect(draggable.draggedElm.translateY).toEqual(0);
      });
    });

    describe("Stimulates mouseup - Checks end()", () => {
      it("end", () => {
        draggable.end();
      });
    });
  });
});
