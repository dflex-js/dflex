/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, DnD } from "@dflex/dnd";

// shared dragged event
let dndEvent: DnD | null;

interface Props {
  id: string;
  style?: { [key: string]: string };
  task: string;
  depth?: number;
}

export const TodoItem = ({ id, task, style, depth = 0 }: Props) => {
  const taskRef = React.useRef() as React.MutableRefObject<HTMLLIElement>;

  React.useEffect(() => {
    store.register({ id, ref: taskRef.current!, depth });
  }, []);

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

        dndEvent = new DnD(id, { x: clientX, y: clientY });
      }
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (dndEvent) {
      const { clientX, clientY } = e.touches[0];

      dndEvent.dragAt(clientX, clientY);
    }
  };

  const onTouchEnd = () => {
    if (dndEvent) {
      dndEvent.endDragging();

      dndEvent = null;

      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchmove", onTouchMove);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];

    if (id) {
      dndEvent = new DnD(id, { x: clientX, y: clientY });

      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("touchmove", onTouchMove);
    }
  };

  return (
    <li
      ref={taskRef}
      id={id}
      onTouchStart={onTouchStart}
      onMouseDown={onMouseDown}
      style={style}
    >
      {task}
    </li>
  );
};

export default TodoItem;
