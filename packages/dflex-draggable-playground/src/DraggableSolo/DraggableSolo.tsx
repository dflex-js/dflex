/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, Draggable } from "@dflex/draggable";
import "./button.css";

// shared dragged event
let dflexDraggable: Draggable;

const id = "DFlex-draggable-solo";

const DraggableSolo = () => {
  const ref = React.createRef() as React.MutableRefObject<HTMLButtonElement>;

  React.useEffect(() => {
    if (ref.current) {
      store.addElmToRegistry(id);
    }

    return () => {
      store.unregister(id);
    };
  }, [ref]);

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
      }
    }
  };

  return (
    <button
      className="button-solo"
      type="button"
      ref={ref}
      key={id}
      id={id}
      onMouseDown={onMouseDown}
    >
      Drag me!
    </button>
  );
};

export default DraggableSolo;
