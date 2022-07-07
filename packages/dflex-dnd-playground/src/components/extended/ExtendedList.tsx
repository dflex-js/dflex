/* eslint-disable react/no-array-index-key */
import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

const ExtendedList = () => {
  const tasks = [];

  for (let i = 1; i <= 100; i += 1) {
    const uni = `${i}-extended`;

    tasks.push({ id: uni, key: uni, task: `${i}` });
  }

  const parentID = "DFlex-1k-elements";

  return (
    <div className="root">
      <div className="extended">
        <ul id={parentID}>
          {tasks.map(({ task, id, key }) => (
            <DFlexDnDComponent
              Component="li"
              registerInput={{ id, parentID }}
              key={key}
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
