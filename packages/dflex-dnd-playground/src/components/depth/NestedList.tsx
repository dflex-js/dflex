import React from "react";

import s from "../Demo.module.css";
import DFlexDnDComponent from "../DFlexDnDComponent";

const NestedList = () => {
  const tasksWork = {
    category: "Work",
    id: "nested-work",
    parentID: "DFlex-nested-todo-task-1",
    depth: 1,
    todo: [
      { id: "nested-mtg-1", task: "Boring mtg", depth: 0 },
      { id: "nested-mtg-2", task: "Another boring mtg", depth: 0 },
    ],
  };

  const taskLife = {
    category: "Life",
    id: "nested-life",
    parentID: "DFlex-nested-todo-task-2",
    depth: 1,
    todo: [
      { id: "nested-gym", task: "Hit the gym", depth: 0 },
      { id: "nested-netflix", task: "Finish eps 120", depth: 0 },
    ],
  };

  return (
    <div className={s.root}>
      <div className={`${s.todo} ${s.nested}`}>
        <DFlexDnDComponent
          Component="div"
          registerInput={{
            id: tasksWork.id,
            parentID: "",
            depth: tasksWork.depth,
          }}
          className={s.todo}
        >
          <p>{tasksWork.category}</p>
          <ul id={tasksWork.id}>
            {tasksWork.todo.map(({ task, id, depth }) => (
              <DFlexDnDComponent
                Component="li"
                registerInput={{ id, depth, parentID: tasksWork.id }}
                key={id}
              >
                {task}
              </DFlexDnDComponent>
            ))}
          </ul>
        </DFlexDnDComponent>
        <DFlexDnDComponent
          registerInput={{
            id: taskLife.id,
            depth: taskLife.depth,
            parentID: "",
          }}
          Component="div"
          className={s.todo}
        >
          <p>{taskLife.category}</p>
          <ul id={taskLife.id}>
            {taskLife.todo.map(({ task, id, depth }) => (
              <DFlexDnDComponent
                Component="li"
                registerInput={{ id, depth, parentID: taskLife.id }}
                key={id}
              >
                {task}
              </DFlexDnDComponent>
            ))}
          </ul>
        </DFlexDnDComponent>
      </div>
    </div>
  );
};

export default NestedList;
