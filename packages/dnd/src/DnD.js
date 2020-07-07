import Draggable from "../Draggable";
import Droppable from "../Droppable";

import store from "./DnDStoreImp";

class DnD extends Droppable {
  constructor(elementId, clickCoordinates) {
    const elementInstance = store.getElmTreeById(elementId);

    const draggable = new Draggable(elementInstance, clickCoordinates);

    super(draggable);
  }
}

export default DnD;
