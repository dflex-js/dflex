---
id: examples
title: Drag & Drop Live Examples
sidebar_label: Live Examples
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

  const Task = ({ id, task }) => {
    // This reference enable DFlex to move the element when required
    const ref = React.useRef();

    React.useEffect(() => {
      // Wait until component is mounted to get the reference
      if (ref) {
        DNDStore.register({ id, ref: ref.current, depth: 0 });
      }
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

  // of course here's any array for the sake of simplify.
  // DFlex depend son `register` to connect nodes which each other.
  const tasks = [
    { id: "mtg", msg: "Meet with Laura" },
    { id: "meetup", msg: "Organize weekly meetup" },
    { id: "gym", msg: "Hit the gym" },
    { id: "proj", msg: "The Rosie Project" },
  ];

  return (
    <div className="todo-container">
      <ul>
        {tasks.map(({ msg, id }) => (
          <Task task={msg} key={id} id={id} />
        ))}
      </ul>
    </div>
  );
}
```

### Key points

> DOM elements are not re-ordered

Reordering the element on each movement will eventually lead to performance disaster. Increase scripting and painting time. Waste all the enhancements you've made on your application.

Instead, simple calculations are made directly to animate each element with `translate(x,y)`.

The new coordinates are stored in the store, so each time the user decides to manipulate the layout DFlex already knows the coordinates without communicating with the browser. Another win for your application performance.

> Continuity

One of the most important concepts in DFlex is to preserve the layout state.
And this is guaranteed temporarily and permanently by keeping track of each
change in the layout and make sure it can be restored automatically in case DOM
node is updated outside DFlex territory.

> Minimal side effect

Because DFlex operates on each DOM node individually it doesn't affect far siblings. Let's suppose you switch first element with the second in a container list contains 100 elements. In mot solutions all the siblings will be notified and manipulated even if they are not effected. With DFlex this is not the case, If you switch A with B then only A and B will be affected and manipulated.

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
