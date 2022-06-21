import React from "react";
import type {
  DraggedEvent,
  InteractivityEvent,
  SiblingsEvent,
  LayoutStateEvent,
} from "@dflex/dnd";

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

  const onDragOver = (e: InteractivityEvent) => {
    // eslint-disable-next-line no-console
    console.log("onDragOver", e);
  };

  const onDragLeave = (e: InteractivityEvent) => {
    // eslint-disable-next-line no-console
    console.log("onDragLeave", e);
  };

  const onStateChange = (e: LayoutStateEvent) => {
    // eslint-disable-next-line no-console
    console.log("onStateChange", e);
  };

  const onDragOutContainer = (e: DraggedEvent) => {
    // eslint-disable-next-line no-console
    console.log("onDragOutContainer", e);
  };

  const onDragOutThreshold = (e: DraggedEvent) => {
    // eslint-disable-next-line no-console
    console.log("onDragOutThreshold", e);
  };

  const onLiftUpSiblings = (e: SiblingsEvent) => {
    // eslint-disable-next-line no-console
    console.log("onLiftUpSiblings", e);
  };

  const onMoveDownSiblings = (e: SiblingsEvent) => {
    // eslint-disable-next-line no-console
    console.log("onMoveDownSiblings", e);
  };

  const parentID = "DFlex-todo-list-with-events";

  return (
    <div className="root">
      <div className="todo">
        <ul id={parentID}>
          {tasks.map(({ msg, id, style }) => (
            <DFlexDnDComponent
              Component={"li"}
              registerInput={{ id, parentID }}
              key={id}
              style={style}
              opts={{
                events: {
                  onDragLeave,
                  onDragOver,
                  onStateChange,
                  onDragOutContainer,
                  onDragOutThreshold,
                  onLiftUpSiblings,
                  onMoveDownSiblings,
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
