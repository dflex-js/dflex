import Draggable from "../Draggable";
import Droppable from "../Droppable";

class DnD extends Droppable {
  constructor(elementId, clickCoordinates) {
    const draggable = new Draggable(elementId, clickCoordinates);

    super(draggable);
  }
}

export default DnD;
