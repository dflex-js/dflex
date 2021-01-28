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

### Building Flexible To-do List

It's a good practice to start with how draggable works in the latter example. Focused on three principles:

- Register the component with the right depth.
- Create dag and drop instance.
- Call dragAt/endDragging when needed.

```jsx live
function TodoList() {
  // Create Shared dragged event holder
  let draggedEvent;

  const { store, DnD } = DFlexDnD;

  const Task = ({ id, task }) => {
    // This reference enable DFlex to move the element when required
    const ref = React.createRef();

    React.useEffect(() => {
      // Wait until component is mounted to get the reference
      if (ref) {
        store.register({ id, element: ref.current, depth: 0 });
      }
    }, [ref]);

    const onMouseMove = (e) => {
      if (draggedEvent) {
        const { clientX, clientY } = e;

        // Drag when mouse is moving!
        draggedEvent.dragAt(clientX, clientY);
      }
    };

    const onMouseUp = () => {
      if (draggedEvent) {
        // This is the end of interactive experience.
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
          // Add event listeners to the entire document.
          // Not just the button boundaries.
          document.addEventListener("mouseup", onMouseUp);
          document.addEventListener("mousemove", onMouseMove);

          // Create Draggable instance
          draggedEvent = new DnD(id, { x: clientX, y: clientY });
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
    // The store only register the element once.
    //Avoid calling register without the correct arguments.
    if (listRef) {
      // Note: depth is one. ul, is higher than list.
      // drag & drop won't work without the correct depth.
      store.register({ id: toID, element: listRef.current, depth: 1 });
    }
  }, [listRef]);

  // of course here's any array for the sake of simplify.
  // DFlex depend son `register` to connect nodes which each other.
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

### Key points

> DOM elements are not re-ordered.

Reordering the element on each movement will eventually lead to performance disaster. Increase scripting and painting time. Waste all the enhancements you've made on your application.

Instead, simple calculations are made directly to animate each element with `translate(x,y)`.

The new coordinates are stored in the store, so each time the user decides to manipulate the layout DFlex already knows the coordinates without communicating with the browser. Another win for your application performance.

> No validation

The API is established on the goodwill behavior. This means validation should be done outside DFlex API to avoid unnecessary complexity and doing the same steps multiple times.

### Strict Movement

You can achieve Horizontal or Vertical done by dragging by yourself. You control the input so you can freeze `X` or `Y`:

```jsx
draggedEvent.dragAt(fixedX, clientY);

// or maybe

draggedEvent.dragAt(clientX, fixedY);
```

How about adding drag handler?

Instead of adding an event to the entire element you can add it to the SVG-handler.
