/* eslint-disable react/no-array-index-key */
import React from "react";
import { TodoItem, TodoContainer, ClickableBox } from "../../components";

const SymmetricList = () => {
  const tasks = Array.from({ length: 4 });

  return (
    <div className="flex justify-center items-center">
      <TodoContainer id="main-list">
        {tasks.map((_, i) => (
          <TodoItem
            id={`main-list-${i}`}
            key={`main-list-${i}`}
            className="w-40"
            opts={{ scroll: { enable: false } }}
          >
            {`main-list-${i}`}
          </TodoItem>
        ))}
      </TodoContainer>
      <ClickableBox link="from-to/list" title="go forward" />
    </div>
  );
};

export default SymmetricList;
