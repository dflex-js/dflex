/* eslint-disable react/no-array-index-key */
import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

const ExtendedList = () => {
  const tasks = [];

  for (let i = 1; i <= 100; i += 1) {
    const uni = `${i}-extended`;

    tasks.push({ id: uni, key: uni, task: `${i}` });
  }

  return (
    <div className="root">
      <div className="extended">
        <ul>
          {tasks.map(({ task, id, key }) => (
            <DFlexDnDComponent
              Component="li"
              registerInput={{ id }}
              key={key}
              opts={{
                commit: {
                  enableAfterEndingDrag: false,
                  enableForScrollOnly: false,
                },
              }}
            >
              {task}
            </DFlexDnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExtendedList;
