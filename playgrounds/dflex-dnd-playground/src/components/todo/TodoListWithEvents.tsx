import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

const TodoListWithEvents = () => {
  const tasks = [
    { id: "mtg", msg: "Meet with Laura" },
    { id: "org", msg: "Organize weekly meetup" },
    {
      id: "proj",
      msg: "Continue working on the project",
    },
    { id: "gym", msg: "Hit the gym" },
  ];

  return (
    <div className="root" style={{ paddingTop: "130px" }}>
      <div className="todo">
        <ul>
          {tasks.map(({ msg, id }) => (
            <DFlexDnDComponent
              useDFlexEvents={true}
              Component={"li"}
              registerInput={{ id }}
              key={id}
              opts={{
                commit: {
                  enableAfterEndingDrag: false,
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
