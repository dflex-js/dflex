---
id: examples
title: Drag & Drop Live Examples
description: JavaScript drag and drop examples
keywords:
  - draggable
  - droppable
  - JavaScript
  - examples
  - Vue
  - React
  - DOM
  - dflex
---

> Soon!

```jsx live
function TodoList() {
  let draggedEvent;

  const { store, DnD } = DFlexDnD;

  const Task = ({ id, task }) => {
    const ref = React.createRef();

    React.useEffect(() => {
      if (ref) {
        store.register({ id, element: ref.current, depth: 0 });
      }
    }, [ref]);

    const onMouseMove = (e) => {
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

    const onMouseDown = (e) => {
      const { button, clientX, clientY } = e;

      // avoid right mouse click and ensure id
      if (typeof button === "number" && button === 0) {
        if (id) {
          document.addEventListener("mouseup", onMouseUp);
          document.addEventListener("mousemove", onMouseMove);

          draggedEvent = new DnD(id, { x: clientX, y: clientY });
          console.log(
            "file: examples.md ~ line 61 ~ draggedEvent",
            draggedEvent
          );
        }
      }
    };

    return (
      <li ref={ref} id={id} onMouseDown={onMouseDown}>
        {task}
      </li>
    );
  };

  const listRef = React.createRef();
  const toID = "myTodo-id";

  React.useEffect(() => {
    if (listRef) {
      store.register({ id: toID, element: listRef.current, depth: 1 });
    }
  }, [listRef]);

  const tasks = [
    { id: "mtg", msg: "Meet with Laura" },
    { id: "org", msg: "Organize weekly meetup" },
    { id: "gym", msg: "Hit the gym" },
    { id: "proj", msg: "The Rosie Project" },
  ];

  return (
    <div className="todo-container">
      <ul ref={listRef} id={toID}>
        {tasks.map(({ msg, id }) => (
          <Task task={msg} id={id} key={id} />
        ))}
      </ul>
    </div>
  );
}
```
