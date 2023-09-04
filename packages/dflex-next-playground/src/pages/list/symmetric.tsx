/* eslint-disable react/no-array-index-key */
import React from "react";
import TodoItem from "../../components/TodoItem";

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
    <div className={`flex min-h-screen flex-col items-center p-6`}>
      <ul className="bg-green-50 border-2 border-blue-50 rounded p-4">
        {tasks.map(({ task, id }) => (
          <TodoItem id={id} key={id} opts={{ scroll: { enable: false } }}>
            {task}
          </TodoItem>
        ))}
      </ul>
    </div>
  );
};

export default SymmetricList;
