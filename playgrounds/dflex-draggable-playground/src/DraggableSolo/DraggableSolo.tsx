/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, Draggable } from "@dflex/draggable";

// shared dragged event
let dflexDraggable: Draggable;

const id = "DFlex-draggable-solo";

const DraggableSolo = () => {
  const [isDragged, setIsDragged] = React.useState(false);

  React.useEffect(() => {
    store.register(id);

    return () => {
      store.unregister(id);
    };
  }, []);

  const onMouseMove = (e: MouseEvent) => {
    if (dflexDraggable) {
      const { clientX, clientY } = e;

      // Drag when mouse is moving!
      dflexDraggable.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (dflexDraggable) {
      dflexDraggable.endDragging();

      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);

      setIsDragged(false);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const { button, clientX, clientY } = e;

    // Avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        dflexDraggable = new Draggable(id, { x: clientX, y: clientY });

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

        setIsDragged(true);
      }
    }
  };

  return (
    <button
      className="button-solo"
      type="button"
      key={id}
      id={id}
      onMouseDown={onMouseDown}
    >
      {isDragged ? <span>Being dragged</span> : <span>Drag me</span>}
    </button>
  );
};

export default DraggableSolo;
