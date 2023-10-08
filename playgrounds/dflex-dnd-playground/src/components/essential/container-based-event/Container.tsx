/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
import React from "react";

import { DnD } from "@dflex/dnd";

interface Props {
  component?: string | React.JSXElementConstructor<any>;
  children: React.ReactNode;
  [x: string]: any;
}

const Container = ({
  component: ContainerComponent = "div",
  children,
  ...rest
}: Props) => {
  let dndEvent: DnD | null;

  const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const { target, button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      const { id } = target as HTMLElement;

      if (id) {
        dndEvent = new DnD(
          id,
          { x: clientX, y: clientY },
          {
            containersTransition: {
              enable: false,
            },
            commit: {
              enableAfterEndingDrag: false,
            },
          },
        );

        (target as HTMLElement).style.background = "pink";
        (target as HTMLElement).style.transition =
          "opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s";

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);
      }
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (e.target && dndEvent) {
      dndEvent.endDragging();

      (e.target as HTMLElement).style.background = "whitesmoke";
      (e.target as HTMLElement).style.transition = "none";

      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dndEvent) {
      const { clientX, clientY } = e;
      dndEvent.dragAt(clientX, clientY);
    }
  };

  return (
    <ContainerComponent onMouseDown={onMouseDown} {...rest}>
      {children}
    </ContainerComponent>
  );
};

export default Container;
