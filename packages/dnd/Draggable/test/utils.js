import { createElement, getBoundingClientRect } from "dflex-utils-test";

import Draggable from "../src";
import { store } from "../../src";

const childInstance1 = createElement({ getBoundingClientRect });
childInstance1.depth = 0;

const childInstance2 = createElement({ getBoundingClientRect });
childInstance2.depth = 0;

const parentInstance = createElement({
  children: [childInstance1.element, childInstance2.element],
  getBoundingClientRect,
});
parentInstance.depth = 1;

function assignDraggable(instance) {
  const elementInstance = store.getElmTreeById(instance.id);

  return new Draggable(elementInstance, {
    x: instance.element.getBoundingClientRect().left,
    y: instance.element.getBoundingClientRect().top,
  });
}

export { childInstance1, childInstance2, parentInstance, assignDraggable };
