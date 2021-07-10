/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-array-index-key */

import React from "react";
import { store } from "@dflex/dnd";
import s from "../Demo.module.css";

import DnDItem from "./DnDItem";

const ExtendedList = () => {
  const ulRef = React.useRef() as React.MutableRefObject<HTMLUListElement>;

  const tasks = [];

  for (let i = 1; i <= 1000; i += 1) {
    const uni = `${i}-extended`;

    tasks.push({ id: uni, key: uni, task: `${i}` });
  }

  React.useEffect(() => {
    store.register({ id: "parent-extended", ref: ulRef.current!, depth: 1 });
  }, []);

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <ul ref={ulRef}>
          {tasks.map(({ task, id, key }) => (
            <DnDItem id={id} key={key} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExtendedList;
