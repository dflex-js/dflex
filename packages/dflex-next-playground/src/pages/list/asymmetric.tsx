/* eslint-disable react/no-array-index-key */
import React from "react";
import s from "../../components/Demo.module.css";
import TodoItem from "../../components/TodoItem";

function AsymmetricList() {
  const tasks = [
    {
      id: "async-meeting-laura",
      task: "Meet with Laura",
      style: { height: "3rem" },
    },
    {
      id: "async-weekly-meetup",
      task: "Organize the weekly meetup",
      style: { height: "6rem" },
    },
    {
      id: "async-project-work",
      task: "Work on the project",
      style: { height: "4rem" },
    },
    {
      id: "async-gym-session",
      task: "Go to the gym",
      style: { height: "3.5rem" },
    },
  ];

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <ul>
          {tasks.map(({ task, id, style }) => (
            <TodoItem
              id={id}
              key={id}
              style={style}
              opts={{ scroll: { enable: false } }}
            >
              {task}
            </TodoItem>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AsymmetricList;
