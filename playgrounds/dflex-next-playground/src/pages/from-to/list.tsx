/* eslint-disable react/no-array-index-key */
import React from "react";
import { TodoItem, TodoContainer, ClickableBox } from "../../components";

const AsymmetricPage = () => {
  const tasks = Array.from({ length: 4 });

  return (
    <div className="flex justify-center items-center">
      <TodoContainer id="sub-list">
        {tasks.map((_, i) => (
          <TodoItem
            id={`sub-list-${i}`}
            key={`sub-list-${i}`}
            opts={{
              scroll: { enable: false },
              commit: {
                enableAfterEndingDrag: false,
              },
            }}
            className="w-40"
          >
            {`sub-list-${i}`}
          </TodoItem>
        ))}
      </TodoContainer>
      <ClickableBox link="/from-to" title="go back" />
    </div>
  );
};

export default AsymmetricPage;
