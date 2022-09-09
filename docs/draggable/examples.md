---
title: Draggable Example
description: "DFlex draggable button example built with React triggered by moue event"
---

Create draggable button with React.

```jsx
import { store, draggable } from "@dflex/dnd";

let dflexDraggable: Draggable;

const id = "DFlex-draggable-btn";

const DraggableButton = () => {
  const ref = React.createRef() as React.MutableRefObject<HTMLButtonElement>;

  React.useEffect(() => {
    if (ref.current) {
      store.register(id);
    }

    return () => {
      store.unregister(id);
    };
  }, [ref]);

  const onMouseMove = (e: MouseEvent) => {
    if (dflexDraggable) {
      const { clientX, clientY } = e;

      // Drag when mouse is moving!
      dflexDraggable.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (dflexDraggable) {
      dflexDraggable.endDragging();

      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const { button, clientX, clientY } = e;

    // Avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        dflexDraggable = new Draggable(id, { x: clientX, y: clientY });

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);
      }
    }
  };

  return (
    <button
      type="button"
      ref={ref}
      key={id}
      id={id}
      onMouseDown={onMouseDown}
    >
      Drag me!
    </button>
  );
};
```
