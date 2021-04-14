/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import "./Todo.css";

import { store, DnD } from "@dflex/dnd";

// shared dragged event
let draggedEvent;

const Task = ({ id, style, task, depth = 0 }) => {
  const taskRef = React.createRef();

  React.useEffect(() => {
    store.register({ id, ref: taskRef.current, depth });
  });

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
    <li ref={taskRef} id={id} style={style} onMouseDown={onMouseDown}>
      {task}
    </li>
  );
};

const TodoList = () => {
  const listRef = React.createRef();

  React.useEffect(() => {
    if (listRef) {
      store.register({
        id: "todo-list",
        ref: listRef.current,
        depth: 1,
      });
    }
  });

  const tasks = [
    { id: "mtg", msg: "Meet with Laura", style: { height: "3rem" } },
    { id: "org", msg: "Organize weekly meetup", style: { height: "6.5rem" } },
    {
      id: "proj",
      msg: "Continue working on the project",
      style: { height: "5rem" },
    },
    { id: "gym", msg: "Hit the gym", style: { height: "4.5rem" } },
  ];

  return (
    <div className="todo-container">
      <ul ref={listRef}>
        {tasks.map(({ msg, id, style }) => (
          <Task task={msg} id={id} style={style} key={id} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
