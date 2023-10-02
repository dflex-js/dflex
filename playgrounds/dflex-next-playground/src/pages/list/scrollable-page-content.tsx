/* eslint-disable react/no-array-index-key */
import React from "react";
import { TodoItem, TodoContainer } from "../../components";

const SymmetricList = () => {
  const tasks = [
    { id: "sym-mtg", task: "Meet with Laura" },
    { id: "clean", task: "Clean the house" },
    {
      id: "sym-shop",
      task: "Go Grocery shopping",
    },
    { id: "sym-gym", task: "Go to the gym" },
  ];

  return (
    <div className="flex flex-col">
      <div className="h-96"></div>
      <TodoContainer id="scrollable-page-content">
        {tasks.map(({ task, id }) => (
          <TodoItem id={id} key={id} opts={{ scroll: { enable: false } }}>
            {task}
          </TodoItem>
        ))}
      </TodoContainer>
    </div>
  );
};

export default SymmetricList;
