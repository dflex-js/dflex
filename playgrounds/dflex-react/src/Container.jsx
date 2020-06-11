/* eslint-disable no-use-before-define */
import React from "react";

import { Draggable } from "@dflex/draggable/src";

const Container = ({
  component: ContainerComponent = "div",
  children,
  ...rest
}) => {
  let mouseEvents;

  let droppable;

  let draggedID = null;

  const onMouseDown = (e) => {
    const { target, button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      const { id } = target;
      console.log("onMouseDown -> id", id);

      if (id) {
        draggedID = id;
        console.log("onMouseDown -> draggedID", draggedID);

        droppable = new Draggable(id, { x: clientX, y: clientY });
        console.log("onMouseDown -> droppable", droppable);

        mouseEvents = [
          { evType: "mousemove", evTarget: document, handler: onMouseMove },
          { evType: "mouseup", evTarget: document, handler: onMouseUp },
        ];

        mouseEvents.forEach(({ evType, evTarget, handler }) => {
          evTarget.addEventListener(evType, handler);
        });
      }
    }
  };

  const onMouseUp = () => {
    if (draggedID) {
      mouseEvents.forEach(({ evType, evTarget, handler }) => {
        evTarget.removeEventListener(evType, handler);
      });

      droppable.setDragged(false);
    }
  };

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;

    droppable.dragAt(clientX, clientY);
  };

  return (
    <ContainerComponent onMouseDown={onMouseDown} {...rest}>
      {children}
    </ContainerComponent>
  );
};

export default Container;
