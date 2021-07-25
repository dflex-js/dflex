/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import s from "../../Demo.module.css";
import TodoItem from "../../DnDComponent";

const TodoList = () => {
  const tasks = [
    {
      id: "asymmetric-mtg",
      task: "Meet with Laura",
      style: { height: "3rem" },
    },
    {
      id: "asymmetric-org",
      task: "Organize weekly meetup",
      style: { height: "8.5rem" },
    },
    {
      id: "asymmetric-proj",
      task: "Continue working on the project",
      style: { height: "5rem" },
    },
    { id: "asymmetric-gym", task: "Hit the gym", style: { height: "4.5rem" } },
  ];

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <ul>
          {tasks.map(({ task, id, style }) => (
            <TodoItem id={id} key={id} style={style}>
              {task}
            </TodoItem>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
