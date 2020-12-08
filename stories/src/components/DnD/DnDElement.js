/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { store, DnD } from "@dflex/dnd/src";

// shared dragged event
let draggedEvent;

const draggedEventElement = ({ id, depth, children }) => {
  const ref = React.createRef();
  // const [isDragged, setIsDragged] = React.useState(false);

  React.useEffect(() => {
    setTimeout(
      // eslint-disable-next-line func-names
      function () {
        store.register({ id, element: ref.current, depth });
      },
      0
    );
  }, []);

  const onMouseUp = () => {
    if (draggedEvent) {
      draggedEvent.endDragging();
      draggedEvent = null;
      // setIsDragged(false);
    }
  };

  const onMouseMove = (e) => {
    if (draggedEvent) {
      const { clientX, clientY } = e;

      draggedEvent.dragAt(clientX, clientY);
    }
  };

  const onMouseDown = (e) => {
    const { button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        draggedEvent = new DnD(id, { x: clientX, y: clientY });
        // setIsDragged(true);
      }
    }
  };

  return (
    <li
      ref={ref}
      key={id}
      id={id}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      className="bg-indigo-300 p-7 hover:bg-indigo-200 rounded shadow cursor-pointer"
    >
      {children}
    </li>
  );
};

export default draggedEventElement;
