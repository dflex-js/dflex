---
id: examples
title: Draggable Live Examples
---

> It's all about mouse events.

### Basic Draggable Component

```jsx live
// Create useable Draggable component
function Draggable() {
  const { store, Draggable } = DFlexDraggable;

  // draggable instance holder
  let draggable;

  // Always provide unique id
  const id = "myID";

  // This reference enable DFlex to move the element when required
  const ref = React.createRef();

  React.useEffect(() => {
    setTimeout(function () {
      // Register our element in the store
      store.register({ id, element: ref.current });
    }, 0);
  }, [id, ref]);

  const onMouseDown = (e) => {
    const { target, button, clientX, clientY } = e;

    // Avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      const { id } = target;

      // Create Draggable instance
      draggable = new Draggable(id, { x: clientX, y: clientY });
    }
  };

  const onMouseUp = () => {
    if (draggable) {
      draggable.endDragging();
      draggable = null;
    }
  };

  const onMouseMove = (e) => {
    if (draggable) {
      const { clientX, clientY } = e;

      // Drag when mouse is moving!
      draggable.dragAt(clientX, clientY);
    }
  };

  return (
    <div
      ref={ref}
      key={id}
      id={id}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={DraggableStyle}
    >
      Drag me, nicely!
    </div>
  );
}
```

### Key points related to draggable

- You can add strictly draggable, moving only horizontal or vertical by yourself
  because you control dragging coordinations.

- You can control the clickable area, simply because it's a mouse event. Could
  be on the entire element or a small button of the element. It's up to you.

- You know when the dragging is going to start and end without adding additional
  API functions.

- It can be nested dragging. Related to a list of elements or just one element. It
  doesn't matter. It is always the same.

### Adding more control to draggable

```jsx live
// Create useable Draggable component
function Draggable() {
  const { store, Draggable } = DFlexDraggable;

  // draggable instance holder
  let draggable;

  // Always provide unique id
  const id = "myID";

  // This reference enable DFlex to move the element when required
  const ref = React.createRef();

  React.useEffect(() => {
    setTimeout(function () {
      // Register our element in the store
      store.register({ id, element: ref.current });
    }, 0);
  }, [id, ref]);

  const onMouseDown = (e) => {
    const { target, button, clientX, clientY } = e;

    // Avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      const { id } = target;

      // Create Draggable instance
      draggable = new Draggable(id, { x: clientX, y: clientY });
    }
  };

  const onMouseUp = () => {
    if (draggable) {
      draggable.endDragging();
      draggable = null;
    }
  };

  const onMouseMove = (e) => {
    if (draggable) {
      const { clientX, clientY } = e;

      // Drag when mouse is moving!
      draggable.dragAt(clientX, clientY);
    }
  };

  return (
    <div
      ref={ref}
      key={id}
      id={id}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={DraggableStyle}
    >
      Drag me, nicely!
    </div>
  );
}
```
