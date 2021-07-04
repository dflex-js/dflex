/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import s from "../Demo.module.css";

import TodoItem from "./TodoItem";

const TodoList = () => {
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
    <div className={s.root}>
      <div className={s.todo}>
        <ul>
          {tasks.map(({ msg, id, style }) => (
            <TodoItem id={id} key={id} task={msg} style={style} />
          ))}
        </ul>
      </div>
    </div>
  );
};
export default TodoList;
