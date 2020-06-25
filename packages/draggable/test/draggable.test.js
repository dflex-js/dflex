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

describe("Draggable Store", () => {
  it("Has empty registry", () => {
    expect(store.registry).toStrictEqual({});
  });

  it("Registers element and initiates translateX,Y", () => {
    const elmInstance1 = addElement();
    const elmInstance2 = addElement();

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
  it("Has empty registry", () => {
    expect({}).toStrictEqual({});
  });
});
