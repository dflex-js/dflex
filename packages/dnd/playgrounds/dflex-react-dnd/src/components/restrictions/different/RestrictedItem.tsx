/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import { store, DnD } from "@dflex/dnd";

interface Props {
  id: string;
  style?: React.CSSProperties;
  title: string;
  depth?: number;
  allowLeavingFromTop: boolean;
  allowLeavingFromBottom: boolean;
  allowLeavingFromLeft: boolean;
  allowLeavingFromRight: boolean;
}

const RestrictedItem = ({
  id,
  title,
  style,
  depth = 0,
  allowLeavingFromTop,
  allowLeavingFromBottom,
  allowLeavingFromLeft,
  allowLeavingFromRight,
}: Props) => {
  const ref = React.useRef() as React.MutableRefObject<HTMLLIElement>;

  let draggedEvent: DnD | null;

  const onMouseMove = (e: MouseEvent) => {
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
    const { button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        draggedEvent = new DnD(
          id,
          { x: clientX, y: clientY },
          {
            restrictions: {
              allowLeavingFromTop,
              allowLeavingFromBottom,
              allowLeavingFromLeft,
              allowLeavingFromRight,
            },
          }
        );

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);
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
      draggedEvent = new DnD(
        id,
        { x: clientX, y: clientY },
        {
          restrictions: {
            allowLeavingFromTop,
            allowLeavingFromBottom,
            allowLeavingFromLeft,
            allowLeavingFromRight,
          },
        }
      );

      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("touchmove", onTouchMove);
    }
  };

  React.useEffect(() => {
    store.register({ id, ref: ref.current, depth });
  }, []);

  return (
    <li
      ref={ref}
      id={id}
      style={style}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {title}
    </li>
  );
};

export default RestrictedItem;
