---
id: examples
title: Draggable Live Examples
description: JavaScript draggable examples
keywords:
  - draggable
  - JavaScript
  - examples
  - Vue
  - React
  - DOM
  - dflex
---

> It's all about mouse events.

### Basic Draggable Component

```jsx live
// Create useable Draggable component
function Draggable({ id = Date.now(), depth = 0 }) {
  const { store, Draggable } = DFlexDraggable;

  // Create Shared dragged event holder
  let draggedEvent;

  // This reference enable DFlex to move the element when required
  const ref = React.createRef();

  React.useEffect(() => {
    // Wait until component is mounted to get the reference
    setTimeout(
      // Register element in the store
      function () {
        store.register({ id, element: ref.current, depth });
      },
      0
    );
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
    <button
      className="button-solo"
      type="button"
      ref={ref}
      key={id}
      id={id}
      onMouseDown={onMouseDown}
    >
      Drag me!
    </button>
  );
}
```

Simple as that. No special components. No extra functionality. Everything so natural. And you don't have to as for extra features. You have full control.

### Drag Handler

> Just trigger the drag over the handler.

Same old, same old. Add the mouse event to SVG handler.

```jsx
<div className="draggable" ref={ref} key={id} id={id}>
  <span className="text"> Drag me</span>
  <HandlerSVG onMouseDown={onMouseDown} />
</div>
```

The full code will be:

```jsx live
// Create useable Draggable component
function Draggable({ id = Date.now(), depth = 0 }) {
  const { store, Draggable } = DFlexDraggable;

  // Create Shared dragged event holder
  let draggedEvent;

  // This reference enable DFlex to move the element when required
  const ref = React.createRef();

  React.useEffect(() => {
    // Wait until component is mounted to get the reference
    setTimeout(
      // Register element in the store
      function () {
        store.register({ id, element: ref.current, depth });
      },
      0
    );
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
    <div className="draggable" ref={ref} key={id} id={id}>
      <span className="text"> Drag me</span>
      <HandlerSVG onMouseDown={onMouseDown} />
    </div>
  );
}
```

Now compare this component to other components available. See how much code you usually write and how deep complexity you can add to achieve the same result with DFlex.

To add Horizontal or Vertical only dragging you control the input so you can freeze X or Y: `draggedEvent.dragAt(clientX, clientY)`
