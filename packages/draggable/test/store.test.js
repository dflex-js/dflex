/* eslint-disable no-plusplus */

import { createElement } from "dflex-utils-test/funcs";
import { store } from "../src";

export const elmInstance1 = createElement();
export const elmInstance2 = createElement();

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
