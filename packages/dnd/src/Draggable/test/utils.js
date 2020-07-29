/* eslint-disable import/prefer-default-export */
import Draggable from "../Draggable";
import store from "../../DnDStore";

function assignDraggable(instance) {
  const elementInstance = store.getElmTreeById(instance.id);

  return new Draggable(elementInstance, {
    x: instance.element.getBoundingClientRect().left,
    y: instance.element.getBoundingClientRect().top,
  });
}

export { assignDraggable };
