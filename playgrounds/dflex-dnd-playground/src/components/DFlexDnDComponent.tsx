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

const isCI = import.meta.env.MODE === "CI";
const logColor = isCI ? "\x1b[31m" : "\x1b[32m"; // Red color for CI, Green color for non-CI
const logMessage = `Running in ${logColor}${
  isCI ? "CI" : "non-CI"
}\x1b[0m environment.`;

// eslint-disable-next-line no-console
console.log(logMessage);

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
      store.register({
        id,
        depth,
        readonly,
        animation: isCI ? null : undefined,
        CSSTransform: {
          background: "#ae51ff",
          "box-shadow": "0 0 8px 4px rgba(255, 255, 255, 0.5)",
          opacity: "0.8",
        },
      });
    }

    return () => {
      store.unregister(id);
    };
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
