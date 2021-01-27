/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import "./Todo.css";

import { store, DnD } from "@dflex/dnd/src";

// shared dragged event
let draggedEvent;

const Task = ({ id, task, depth = 0 }) => {
  const ref = React.createRef();

  React.useEffect(() => {
    setTimeout(
      // eslint-disable-next-line func-names
      function () {
        store.register({ id, element: ref.current, depth });
      },
      0
    );
  }, []);

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
      }
    }
  };

  return (
    <li ref={ref} key={id} id={id} onMouseDown={onMouseDown}>
      {task}
    </li>
  );
};

const TodoList = () => {
  const tasks = [
    { id: "mtg", msg: "Meet with Laura" },
    { id: "org", msg: "Organize weekly meetup" },
    { id: "gym", msg: "Hit the gym" },
    { id: "proj", msg: "Continue working on the project" },
  ];

  return (
    <div className="todo-container">
      <ol className="gradient-list">
        {tasks.map(({ msg, id }) => (
          <Task task={msg} id={id} key={id} />
        ))}
      </ol>
    </div>
  );
};

export default TodoList;
