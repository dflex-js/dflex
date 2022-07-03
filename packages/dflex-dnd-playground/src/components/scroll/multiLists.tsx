/* eslint-disable react/no-array-index-key */
import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

const MultiLists = () => {
  const tasks1 = [];
  const tasks2 = [];
  const tasks3 = [];

  for (let i = 1; i <= 20; i += 1) {
    const uni = `scroll-c1-${i}`;
    tasks1.push({ id: uni, key: uni, task: `${i}` });
  }

  for (let i = 1; i <= 100; i += 1) {
    const uni = `scroll-c2-${i}`;
    tasks2.push({ id: uni, key: uni, task: `${i}` });
  }

  for (let i = 1; i <= 10; i += 1) {
    const uni = `scroll-c3-${i}`;
    tasks3.push({ id: uni, key: uni, task: `${i}` });
  }

  const ID_PARENT_1 = "multi-p1";
  const ID_PARENT_2 = "multi-p2";
  const ID_PARENT_3 = "multi-p3";

  return (
    <div className="list-migration">
      {[
        { tasks: tasks1, parentID: ID_PARENT_1 },
        { tasks: tasks2, parentID: ID_PARENT_2 },
        { tasks: tasks3, parentID: ID_PARENT_3 },
      ].map(({ tasks, parentID }) => (
        <ul id={parentID} key={parentID} style={{ overflow: "auto" }}>
          {tasks.map(({ task, id, key }) => (
            <DFlexDnDComponent
              Component={"li"}
              registerInput={{ parentID: ID_PARENT_1, id }}
              key={key}
            >
              {task}
            </DFlexDnDComponent>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default MultiLists;
