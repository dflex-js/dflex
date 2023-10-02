/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, Draggable } from "@dflex/draggable";
import HandlerSVG from "./HandlerSVG";

// shared dragged event
let draggedEvent: Draggable;
const id = "DFlex-draggable-with-handler";

const DraggableHandler = () => {
  const [isDragged, setIsDragged] = React.useState(false);

  React.useEffect(() => {
    store.register(id);

    return () => {
      store.unregister(id);
    };
  }, []);

  const onMouseMove = (e: MouseEvent) => {
    if (draggedEvent) {
      const { clientX, clientY } = e;

      // Drag when mouse is moving!
      draggedEvent.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (draggedEvent) {
      draggedEvent.endDragging();

      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);

      setIsDragged(false);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const { button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        draggedEvent = new Draggable(id, { x: clientX, y: clientY });

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

        setIsDragged(true);
      }
    }
  };

  return (
    <div className="button-solo" id={id}>
      {isDragged ? <span>Being dragged!</span> : <span>Drag me!</span>}
      <HandlerSVG onMouseDown={onMouseDown} />
    </div>
  );
};

export default DraggableHandler;
