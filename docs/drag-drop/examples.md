---
title: Drag and Drop Examples
description: "DFlex drag and drop todo example built with React."
---

### Three principles

In all DFlex examples it's important to focus on three principles:

- `register`/`unregister` component in the store.
- Create dag and drop instance.
- Call `dragAt`/`endDragging` when needed.

### Building Todo List

```jsx
import { store, DnD } from "@dflex/dnd";

const Task = ({ id, task }) => {
  let dndEvent;

  // This reference enable DFlex to move the element when required.
  const ref = React.useRef();

  React.useEffect(() => {
    // Wait until component is mounted to get the reference
    if (ref) {
      store.register({ id, ref: ref.current });
      // All the following inputs work fine:
      // store.register({ ref: ref.current });
      // store.register({ id });
      // store.register({ id, ref: ref.current, depth: 0 });
      // store.register({ id, ref: ref.current, parentID: "my-first-todo" });
    }
  }, [ref]);

  React.useEffect(() => {
    return () => {
      // Clear element from the store when unmounted.
      store.unregister(id);
    };
  }, []);

  const onMouseMove = (e) => {
    if (dndEvent) {
      const { clientX, clientY } = e;

      // Drag when mouse is moving!
      dndEvent.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (dndEvent) {
      // This is the end of interactive experience.
      dndEvent.endDragging();
      dndEvent = null;

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

        // Create DnD instance with no custom options.
        dndEvent = new DnD(id, { x: clientX, y: clientY });
      }
    }
  };

  return (
    <li ref={ref} id={id} onMouseDown={onMouseDown}>
      {task}
    </li>
  );
};

const TodoList = () => {
  React.useEffect(() => {
    return () => {
      // Destroy all elements from the store when unmounted.
      store.destroy();
    };
  }, []);

  const tasks = [
    { id: "mtg", msg: "Meet with Laura" },
    { id: "meetup", msg: "Organize weekly meetup" },
    { id: "gym", msg: "Hit the gym" },
    { id: "proj", msg: "The Rosie Project" },
  ];

  return (
    <ul id="my-first-todo">
      {tasks.map(({ msg, id }) => (
        <Task task={msg} key={id} id={id} />
      ))}
    </ul>
  );
};
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

How about adding drag handler?

Instead of adding an event to the entire element you can add it to the SVG-handler.
