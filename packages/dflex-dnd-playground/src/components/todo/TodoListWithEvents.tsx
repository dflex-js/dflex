import React from "react";
// import type { LayoutStateEvent } from "@dflex/dnd";

import DFlexDnDComponent from "../DFlexDnDComponent";

const TodoListWithEvents = () => {
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
    <div className="root">
      <div className="todo">
        <ul>
          {tasks.map(({ msg, id, style }) => (
            <DFlexDnDComponent
              Component={"li"}
              registerInput={{ id }}
              key={id}
              style={style}
              opts={{
                commit: {
                  enableAfterEndingDrag: false,
                  enableForScrollOnly: false,
                },
              }}
            >
              {msg}
            </DFlexDnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoListWithEvents;
