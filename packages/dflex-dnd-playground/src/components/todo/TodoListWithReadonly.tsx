import React from "react";

import s from "../Demo.module.css";

import DFlexDnDComponent from "../DFlexDnDComponent";

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

  const parentID = "DFlex-todo-list-with-readonly";

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <ul id={parentID}>
          {tasks.map(({ msg, id, readonly, style }) => (
            <DFlexDnDComponent
              Component={"li"}
              registerInput={{ id, readonly, parentID }}
              key={id}
              style={style}
            >
              {msg}
            </DFlexDnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default TodoListWithReadonly;
