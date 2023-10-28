import React from "react";
import cn from "classnames";
import { store, DnD } from "@dflex/dnd";
import type { DFlexDnDOpts } from "@dflex/dnd";

// shared dragged event
let draggedEvent: DnD | null;

interface Props {
  Component?: string | React.JSXElementConstructor<any>;
  id: string;
  style?: { [key: string]: string };
  className?: string;
  opts?: DFlexDnDOpts;
  task?: string;
  depth?: number;
  children?: React.ReactNode;
}

export function TodoItem({
  Component = "li",
  id,
  task,
  style,
  className,
  children,
  opts,
  depth = 0,
}: Props) {
  const taskRef = React.useRef() as React.MutableRefObject<HTMLLIElement>;

  React.useEffect(() => {
    store.register({
      id,
      depth,
      CSSTransform: {
        background: "#67e8f9",
        opacity: "0.5",
      },
    });

    return () => {
      store.unregister(id);
    };
  }, [taskRef.current]);

  const onMouseMove = (e: MouseEvent) => {
    e.stopPropagation();

    if (draggedEvent) {
      const { clientX, clientY } = e;

      draggedEvent.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (draggedEvent) {
      draggedEvent.endDragging();

      draggedEvent = null;

      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
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

        draggedEvent = new DnD(id, { x: clientX, y: clientY }, opts);
      }
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (draggedEvent) {
      const { clientX, clientY } = e.touches[0];

      draggedEvent.dragAt(clientX, clientY);
    }
  };

  const onTouchEnd = () => {
    if (draggedEvent) {
      draggedEvent.endDragging();

      draggedEvent = null;

      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchmove", onTouchMove);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];

    if (id) {
      draggedEvent = new DnD(id, { x: clientX, y: clientY }, opts);

      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("touchmove", onTouchMove);
    }
  };

  return (
    <Component
      ref={taskRef}
      id={id}
      onTouchStart={onTouchStart}
      onMouseDown={onMouseDown}
      style={style}
      className={cn(
        "border border-blue-300 bg-blue-100 rounded py-2 px-4 my-4 flex items-center justify-center",
        [!style && "h-16"],
        className,
      )}
    >
      <div>{task || children}</div>
    </Component>
  );
}

export default TodoItem;
