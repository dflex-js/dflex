/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import type {
  DraggedEvent,
  InteractivityEvent,
  SiblingsEvent,
  LayoutStateEvent,
} from "@dflex/dnd";
import s from "../Demo.module.css";

import DnDComponent from "../DnDComponent";

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

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <ul>
          {tasks.map(({ msg, id, style }) => (
            <DnDComponent
              id={id}
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
            </DnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default TodoList;
