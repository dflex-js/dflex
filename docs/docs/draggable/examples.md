---
id: examples
title: Draggable Live Examples
---

### Create Draggable React Component From Scratch

```jsx live
function Draggable(props) {
  const { store, Draggable } = DFlexDraggable;

  let draggable;

  const id = "myID";

  const ref = React.createRef();

  React.useEffect(() => {
    setTimeout(function () {
      store.register({ id, element: ref.current });
    }, 0);
  }, [id, ref]);

  const onMouseDown = (e) => {
    const { target, button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      const { id } = target;

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
      "Drag me"
    </div>
  );
}
```
