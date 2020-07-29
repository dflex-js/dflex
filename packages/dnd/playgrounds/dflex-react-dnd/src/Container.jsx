/* eslint-disable no-use-before-define */
import React from "react";

import { DnD } from "@dflex/dnd/src";

const Container = ({
  component: ContainerComponent = "div",
  children,
  ...rest
}) => {
  let mouseEvents;

  let dnd;

  let draggedID = null;

  const onMouseDown = (e) => {
    const { target, button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      const { id } = target;

      if (id) {
        draggedID = id;

        dnd = new DnD(id, { x: clientX, y: clientY });

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
      dnd.endDragging();
    }
  };

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;

    dnd.dragAt(clientX, clientY);
  };

  return (
    <ContainerComponent onMouseDown={onMouseDown} {...rest}>
      {children}
    </ContainerComponent>
  );
};

export default Container;
