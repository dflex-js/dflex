import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

const TodoListWithMargin = () => {
  return (
    <div className="root">
      <div className="todo">
        <ul style={{ margin: "240px" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <DFlexDnDComponent
              Component={"li"}
              registerInput={{ id: `${i}` }}
              key={`${i}`}
              opts={{
                commit: {
                  enableAfterEndingDrag: false,
                  enableForScrollOnly: false,
                },
              }}
            >
              {`${i}`}
            </DFlexDnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoListWithMargin;
