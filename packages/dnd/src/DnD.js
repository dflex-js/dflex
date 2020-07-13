import store from "@dflex/dnd-store";

import Draggable from "@dflex/dnd-draggable";
import Droppable from "@dflex/dnd-droppable";

class DnD extends Droppable {
  constructor(elementId, clickCoordinates) {
    const elementInstance = store.getElmTreeById(elementId);

    const draggable = new Draggable(elementInstance, clickCoordinates);

    super(draggable);
  }
}

export default DnD;
