/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, DnD } from "@dflex/dnd";
import type { DFlexDnDOpts, DFlexEvents } from "@dflex/dnd";

// const evts = new Set([
//   "$onDragOutContainer",
//   "$onDragOutThreshold",
//   "$onDragOver",
//   "$onDragLeave",
//   "$onLiftUpSiblings",
//   "$onMoveDownSiblings",
// ]);

let dflexDnD: DnD | null;

interface Props {
  Component: string | React.JSXElementConstructor<any>;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  registerInput: {
    id: string;
    depth?: number;
    readonly?: boolean;
  };
  opts?: DFlexDnDOpts;
}

const DFlexDnDComponent = ({
  Component,
  registerInput,
  style,
  className,
  children,
  opts,
}: Props) => {
  const taskRef = React.useRef() as React.MutableRefObject<HTMLLIElement>;

  const { id, depth, readonly } = registerInput;

  React.useEffect(() => {
    if (taskRef.current) {
      store.register({ id, depth, readonly });
    }
  }, [taskRef]);

  const onDFlexEvent = (e: DFlexEvents) => {
    // eslint-disable-next-line no-console
    console.log(`onDFlexEvent: ${e.type}`, e.detail);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dflexDnD) {
      const { clientX, clientY } = e;

      dflexDnD.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (dflexDnD) {
      dflexDnD.endDragging();

      dflexDnD = null;

      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);

      document.removeEventListener("$onDragLeave", onDFlexEvent);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    const { button, clientX, clientY } = e;

    // Avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);
        dflexDnD = new DnD(id, { x: clientX, y: clientY }, opts);

        document.addEventListener("$onDragLeave", onDFlexEvent);
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
