/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
// import type {
//   DraggedEvent,
//   InteractivityEvent,
//   SiblingsEvent,
//   LayoutStateEvent,
// } from "@dflex/dnd";
import s from "../Demo.module.css";

import DnDComponent from "../DnDComponent";

const TodoListWithReadonly = () => {
  const tasks = [
    {
      readonly: false,
      id: "interactive-1",
      msg: "Interactive task 1",
      style: { height: "4.5rem" },
    },
    {
      readonly: true,
      id: "readonly-1",
      msg: "Readonly task 1",
      style: { height: "4.5rem" },
    },
    {
      readonly: false,
      id: "interactive-2",
      msg: "Interactive task 2",
      style: { height: "4.5rem" },
    },
    {
      readonly: true,
      id: "readonly-2",
      msg: "Readonly task 2",
      style: { height: "4.5rem" },
    },
  ];

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <ul>
          {tasks.map(({ msg, id, readonly, style }) => (
            <DnDComponent
              registerInput={{ id, readonly }}
              key={id}
              style={style}
            >
              {msg}
            </DnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default TodoListWithReadonly;
