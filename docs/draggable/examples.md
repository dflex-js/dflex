---
title: Draggable Example
description: "DFlex draggable button example built with React triggered by moue event."
---

Create draggable button with React.

```jsx
import { store, draggable } from "@dflex/dnd";

const DraggableButton = () => {
  const id = "draggable-button";

  // Create Shared dragged event holder
  let draggedEvent;

  // This reference enable DFlex to move the element when required.
  const ref = React.createRef();

  React.useEffect(() => {
    // Wait until component is mounted to get the reference
    if (ref) {
      store.register({ id, ref: ref.current });
      // All the following inputs work fine:
      // store.register({ ref: ref.current });
      // store.register({ id });
    }
  }, [ref]);

  React.useEffect(() => {
    return () => {
      // Clear element from the store when unmounted.
      store.unregister(id);
    };
  }, []);

  const onMouseMove = (e) => {
    if (draggedEvent) {
      const { clientX, clientY } = e;

      // Drag when mouse is moving!
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

  const onMouseDown = (e) => {
    const { button, clientX, clientY } = e;

    // Avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        // Create Draggable instance
        draggedEvent = new Draggable(id, { x: clientX, y: clientY });

        // Add event listeners to the entire document. Not just the button boundaries.
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);
      }
    }
  };

  return (
    <button ref={ref} id={id} type="button" onMouseDown={onMouseDown}>
      Drag me!
    </button>
  );
};
```
