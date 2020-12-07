import Draggable from "./Draggable";
import Droppable from "./Droppable";

import store from "./DnDStore";

class DnD extends Droppable {
  constructor(
    elementId,
    clickCoordinates,
    opts = { onDragged: {}, onDropped: {} }
  ) {
    const elementInstance = store.getElmTreeById(elementId);

    const draggable = new Draggable(
      elementInstance,
      clickCoordinates,
      opts.onDragged
    );

    super(draggable, opts.onDragged);
  }
}

export default DnD;
