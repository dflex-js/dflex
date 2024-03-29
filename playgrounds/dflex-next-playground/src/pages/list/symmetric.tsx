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
    <TodoContainer id="symmetric-container-list">
      {tasks.map(({ task, id }) => (
        <TodoItem id={id} key={id} opts={{ scroll: { enable: false } }}>
          {task}
        </TodoItem>
      ))}
    </TodoContainer>
  );
};

export default SymmetricList;
