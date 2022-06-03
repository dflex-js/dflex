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
      readonly: true,
      id: "readonly-1",
      msg: "Read",
      style: { height: "3rem" },
    },
    {
      readonly: false,
      id: "org",
      msg: "Organize weekly meetup",
      style: { height: "6.5rem" },
    },
    {
      readonly: true,
      id: "readonly-2",
      msg: "Continue working on the project",
      style: { height: "5rem" },
    },
    {
      readonly: true,
      id: "readonly-3",
      msg: "Hit the gym",
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
