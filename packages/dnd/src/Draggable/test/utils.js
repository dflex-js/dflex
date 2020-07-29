/* eslint-disable import/prefer-default-export */
import Draggable from "../src";
import { store } from "../../src";

function assignDraggable(instance) {
  const elementInstance = store.getElmTreeById(instance.id);

  return new Draggable(elementInstance, {
    x: instance.element.getBoundingClientRect().left,
    y: instance.element.getBoundingClientRect().top,
  });
}

export { assignDraggable };
