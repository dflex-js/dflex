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
  it("Stimulates mousedown click- Inits draggable", () => {
    draggable = new Draggable(elmInstance1.id, { x: clientX, y: clientY });

    expect(draggable.draggedElm.translateX).toEqual(0);
    expect(draggable.draggedElm.translateY).toEqual(0);

    expect(draggable.goToX).toEqual(0);
    expect(draggable.goToY).toEqual(0);

    //   offsetX: -10,
    // offsetY: -20,
    // goToX: 49,
    // goToY: 49
  });

  it("Stimulates mousemove - Checks dragAt()", () => {
    for (let i = 0; i < movingPixels; i += 1) {
      draggable.dragAt(clientX + i, clientY + i);
    }
    console.log(draggable);
  });

  it("true", () => {
    expect(true).toEqual(true);
  });

  it("end", () => {
    draggable.end();
  });
});
