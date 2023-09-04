/* eslint-disable react/no-array-index-key */
import React from "react";
import TodoItem from "../../components/TodoItem";

const AsymmetricPage = () => {
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

export default AsymmetricPage;
