/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { store, Draggable } from "@dflex/draggable";

import s from "../Demo.module.css";

const DRAG_ME = "Drag me!";

const DraggableBtn = () => {
  const id = "draggable-btn";

  const ref = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

  const [title, setTittle] = React.useState(DRAG_ME);

  let draggedEvent: Draggable | null;

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

      setTittle(DRAG_ME);

      ref.current.blur();
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const { button, clientX, clientY } = e;

    if (typeof button === "number" && button === 0) {
      setTittle("that's cool");
      draggedEvent = new Draggable(id, { x: clientX, y: clientY });

      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
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

      setTittle(DRAG_ME);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];

    if (id) {
      setTittle("that's cool");
      draggedEvent = new Draggable(id, { x: clientX, y: clientY });

      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("touchmove", onTouchMove);
    }
  };

  React.useEffect(() => {
    store.register({ id, ref: ref.current! });

    return () => {
      store.unregister(id);
    };
  }, []);

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <button
          className={s.buttonSolo}
          type="button"
          ref={ref}
          id={id}
          onTouchStart={onTouchStart}
          onMouseDown={onMouseDown}
        >
          {title}
        </button>
      </div>
    </div>
  );
};

export default DraggableBtn;
