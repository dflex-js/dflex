/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
import React from "react";

import { DnD } from "@dflex/dnd";

interface IProps {
  component: any;
  children?: React.ReactNode;
}

const Container = ({
  component: ContainerComponent = "div",
  children,
  ...rest
}: IProps) => {
  let mouseEvents: {
    evType: string;
    evTarget: Document;
    handler: (e: React.MouseEvent<HTMLButtonElement>) => MouseEvent;
  }[];

  let dnd: DnD;

  let draggedID: string | null = null;

  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
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

        const mouseEvents = [
          { evType: "mousemove", evTarget: document, handler: onMouseMove },
          { evType: "mouseup", evTarget: document, handler: onMouseUp },
        ];

        mouseEvents.forEach(({ evType, evTarget, handler }) => {
          evTarget.addEventListener(evType, handler);
        });
      }
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (e.currentTarget && draggedID) {
      mouseEvents.forEach(({ evType, evTarget, handler }) => {
        //@ts-expect-error
        evTarget.removeEventListener(evType, handler);
      });
      dnd.endDragging();

      (e.currentTarget as HTMLBodyElement).style.background = "whitesmoke";
      (e.currentTarget as HTMLBodyElement).style.transition = "none";
    }
  };

  const onMouseMove = (e: MouseEvent) => {
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
