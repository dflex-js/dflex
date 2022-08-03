import type { DFlexElmType } from "@dflex/dnd";
import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

type Task = {
  id: string;
  type: DFlexElmType;
  msg: string;
  style: React.CSSProperties;
};

const TodoListWithReadonly = () => {
  const tasks: Task[] = [
    {
      type: "interactive",
      id: "interactive-1",
      msg: "Interactive task 1",
      style: { height: "4.5rem" },
    },
    {
      type: "draggable",
      id: "readonly-1",
      msg: "Readonly task 1",
      style: { height: "4.5rem" },
    },
    {
      type: "interactive",
      id: "interactive-2",
      msg: "Interactive task 2",
      style: { height: "4.5rem" },
    },
    {
      type: "draggable",
      id: "readonly-2",
      msg: "Readonly task 2",
      style: { height: "4.5rem" },
    },
  ];

  return (
    <div className="root">
      <div className="todo">
        <ul>
          {tasks.map(({ msg, id, type, style }) => (
            <DFlexDnDComponent
              Component={"li"}
              registerInput={{ id, type }}
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
