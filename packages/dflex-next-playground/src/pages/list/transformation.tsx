/* eslint-disable react/no-array-index-key */
import React from "react";
import TodoItem from "../../components/TodoItem";

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
    <div className={`flex min-h-screen flex-col items-center p-6`}>
      <ul className="bg-green-50 border-2 border-blue-50 rounded p-4">
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
  );
};

export default TransformationPage;
