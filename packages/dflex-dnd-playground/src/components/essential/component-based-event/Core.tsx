/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, DnD } from "@dflex/dnd";

// shared dragged event
let dflexDnD: DnD | null;

interface Props {
  component: string | React.JSXElementConstructor<any>;
  id: string;
  children: React.ReactNode;
  depth: number;
  enableContainersTransition?: boolean;
  style?: React.CSSProperties;
}

const Core = ({
  component: CoreComponent = "div",
  id,
  children,
  depth,
  enableContainersTransition = false,
  style,
}: Props) => {
  const ref = React.useRef() as React.MutableRefObject<HTMLLIElement>;

  const [isDragged, setIsDragged] = React.useState(false);

  React.useEffect(() => {
    if (ref.current) {
      store.register({ id, depth, animation: null });
    }
  }, [ref]);

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

      setIsDragged(false);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    const { button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

        dflexDnD = new DnD(
          id,
          { x: clientX, y: clientY },
          {
            containersTransition: {
              enable: enableContainersTransition,
            },
            commit: {
              enableAfterEndingDrag: false,
              enableForScrollOnly: false,
            },
          }
        );

        setIsDragged(true);
      }
    }
  };

  return (
    <CoreComponent
      ref={ref}
      key={id}
      id={id}
      onMouseDown={onMouseDown}
      style={{
        ...style,
        ...(isDragged
          ? {
              background: "pink",
              transition: "opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s",
            }
          : {}),
      }}
    >
      {children}
    </CoreComponent>
  );
};

export default Core;
