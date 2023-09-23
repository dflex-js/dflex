/* eslint-disable react/no-array-index-key */
import React from "react";
import { TodoItem, TodoContainer } from "../../components";

const TransformationPage = () => {
  const tasks = [
    { id: "trans-clean", task: "Clean the house" },
    {
      id: "trans-shop",
      task: "Grocery shopping",
    },
    { id: "trans-gym", task: "Hit the gym" },
  ];

  return (
    <TodoContainer id="trans-container-list">
      {tasks.map(({ task, id }) => (
        <TodoItem id={id} key={id} opts={{ scroll: { enable: false } }}>
          {task}
        </TodoItem>
      ))}
    </TodoContainer>
  );
};

export default TransformationPage;
