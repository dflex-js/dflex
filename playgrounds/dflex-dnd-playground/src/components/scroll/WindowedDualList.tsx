/* eslint-disable react/no-array-index-key */
import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

/**
 * Windowed Dual List Component
 *
 * This component represents a dual list with a windowed scroll, each containing a hundred elements.
 * It is designed to demonstrate the following functionalities:
 *
 * 1. Element visibility tracking while scrolling.
 * 2. Assessing the scroll performance for a list with an unusually large number of elements.
 *
 */
const WindowedDualList = () => {
  const tasks1 = [];
  const tasks2 = [];

  for (let i = 1; i <= 15; i += 1) {
    const uni1 = `list-a-${i}`;
    const uni2 = `list-b-${i}`;

    tasks1.push({ id: uni1, key: uni1, task: `${i}-a` });
    tasks2.push({ id: uni2, key: uni2, task: `${i}-b` });
  }

  return (
    <div className="root" style={{ paddingBottom: "200px" }}>
      <div className="extended">
        <ul>
          {tasks1.map(({ task, id, key }) => (
            <DFlexDnDComponent
              Component="li"
              registerInput={{ id }}
              key={key}
              opts={{
                commit: {
                  enableAfterEndingDrag: false,
                },
              }}
            >
              {task}
            </DFlexDnDComponent>
          ))}
        </ul>
      </div>
      <div className="extended">
        <ul>
          {tasks2.map(({ task, id, key }) => (
            <DFlexDnDComponent
              Component="li"
              registerInput={{ id }}
              key={key}
              opts={{
                commit: {
                  enableAfterEndingDrag: false,
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

export default WindowedDualList;
