import Event from "@dflex/event/src";

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

    const { onDraggedOver } = opts;

    const draggable = new Draggable(
      elementInstance,
      clickCoordinates,
      opts.onDragged
    );

    let droppableOpts = opts;

    if (onDraggedOver && typeof onDraggedOver === "function") {
      const onDraggedOverEvt = new Event("onDraggedOver");
      onDraggedOverEvt.create();

      droppableOpts = { event: onDraggedOverEvt, ...opts.onDropped };
    }

    super(draggable, droppableOpts);
  }
}

export default DnD;
