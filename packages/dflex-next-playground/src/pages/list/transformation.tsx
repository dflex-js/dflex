/* eslint-disable react/no-array-index-key */
import React from "react";
import s from "../../components/Demo.module.css";
import TodoItem from "../../components/TodoItem";

const TransformationList = () => {
  const tasks = [
    { id: "trans-clean", task: "Clean the house" },
    {
      id: "trans-shop",
      task: "Grocery shopping",
    },
    { id: "trans-gym", task: "Hit the gym" },
  ];

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <ul>
          {tasks.map(({ task, id }) => (
            <TodoItem
              id={id}
              key={id}
              opts={{
                scroll: { enable: false },
                commit: { enableAfterEndingDrag: false },
              }}
            >
              {task}
            </TodoItem>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransformationList;
