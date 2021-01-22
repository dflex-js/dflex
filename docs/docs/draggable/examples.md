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
