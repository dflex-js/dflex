/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
import React from "react";

import { DnD } from "@dflex/dnd";

const Container = ({
  component: ContainerComponent = "div",
  children,
  ...rest
}) => {
  let mouseEvents;
  let dnd;

  let draggedID;

  const onMouseDown = (e) => {
    const { currentTarget, button, clientX, clientY } = e;

    // const target = e.target as HTMLTextAreaElement;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      const { id } = currentTarget;

      if (currentTarget && id) {
        draggedID = id;

        dnd = new DnD(id, { x: clientX, y: clientY });

        currentTarget.style.background = "pink";
        currentTarget.style.transition =
          "opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s";

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

  const onMouseUp = (e) => {
    if (e.currentTarget && draggedID) {
      mouseEvents.forEach(({ evType, evTarget, handler }) => {
        // @ts-expect-error
        evTarget.removeEventListener(evType, handler);
      });
      dnd.endDragging();

      e.currentTarget.style.background = "whitesmoke";
      e.currentTarget.style.transition = "none";
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
