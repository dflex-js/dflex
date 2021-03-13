/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { store, Draggable } from "@dflex/draggable";
import "./draggableHandler.css";
import HandlerSVG from "./HandlerSVG";

// shared dragged event
let draggedEvent;

const DraggableHandler = ({ id = "draggableSolo", depth = 0 }) => {
  // This reference enable DFlex to move the element when required
  const ref = React.createRef();
  //   const [isDragged, setIsDragged] = React.useState(false);

  React.useEffect(() => {
    setTimeout(
      // eslint-disable-next-line func-names
      () => {
        store.register({ id, ref: ref.current, depth });
      },
      0
    );
  }, []);

  const onMouseMove = (e) => {
    if (draggedEvent) {
      const { clientX, clientY } = e;

      // Drag when mouse is moving!
      draggedEvent.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (draggedEvent) {
      draggedEvent.endDragging();
      draggedEvent = null;

      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  const onMouseDown = (e) => {
    const { button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        draggedEvent = new Draggable(id, { x: clientX, y: clientY });

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);
      }
    }
  };

  return (
    <div className="draggable" ref={ref} key={id} id={id}>
      <span className="text"> Drag me</span>
      <HandlerSVG onMouseDown={onMouseDown} />
    </div>
  );
};

export default DraggableHandler;
