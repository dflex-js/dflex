/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, DnD } from "@dflex/dnd";
import type { DndOpts } from "@dflex/dnd";

// shared dragged event
let dndEvent: DnD | null;

interface Props {
  Component: string | React.JSXElementConstructor<any>;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  registerInput: {
    id: string;
    parentID: string;
    depth?: number;
    readonly?: boolean;
  };
  opts?: DndOpts;
}

export const DFlexDnDComponent = ({
  Component,
  registerInput,
  style,
  className,
  children,
  opts,
}: Props) => {
  const taskRef = React.useRef() as React.MutableRefObject<HTMLLIElement>;

  const { id, parentID, depth, readonly } = registerInput;

  React.useEffect(() => {
    if (taskRef.current) {
      store.register({ id, parentID, depth, readonly });
    }

    return () => {
      store.unregister(id);
    };
  }, [taskRef.current]);

  const onMouseMove = (e: MouseEvent) => {
    if (dndEvent) {
      const { clientX, clientY } = e;

      dndEvent.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (dndEvent) {
      dndEvent.endDragging();

      dndEvent = null;

      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const { button, clientX, clientY } = e;

    // Avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);
        dndEvent = new DnD(id, { x: clientX, y: clientY }, opts);
      }
    }
  };

  return (
    <Component
      ref={taskRef}
      id={id}
      onMouseDown={onMouseDown}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};

export default DFlexDnDComponent;
