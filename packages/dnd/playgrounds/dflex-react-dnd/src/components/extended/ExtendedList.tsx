

/* eslint-disable react/no-array-index-key */
import React from "react";
import s from "../Demo.module.css";

import DnDComponent from "../DnDComponent";

const ExtendedList = () => {
  const tasks = [];

  for (let i = 1; i <= 100; i += 1) {
    const uni = `${i}-extended`;

    tasks.push({ id: uni, key: uni, task: `${i}` });
  }

  return (
    <div className={s.root}>
      <div className={s.extended}>
        <ul>
          {tasks.map(({ task, id, key }) => (
            <DnDComponent
              id={id}
              key={key}
              // opts={{ scroll: { enable: false } }}
            >
              {task}
            </DnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExtendedList;
