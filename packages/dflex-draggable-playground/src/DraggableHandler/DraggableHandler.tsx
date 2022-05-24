/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, Draggable } from "@dflex/draggable";
import "./draggableHandler.css";
import HandlerSVG from "./HandlerSVG";

// shared dragged event
let draggedEvent: Draggable;

const DraggableHandler = ({ id = "draggableSolo" }) => {
  const ref = React.createRef() as React.MutableRefObject<HTMLDivElement>;

  React.useEffect(() => {
    setTimeout(
      // eslint-disable-next-line func-names
      () => {
        store.register({ id, ref: ref.current });
      },
      0
    );
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
