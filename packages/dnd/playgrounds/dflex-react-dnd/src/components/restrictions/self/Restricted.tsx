/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import s from "../../Demo.module.css";
import RestrictedItem from "../RestrictedItem";

const Restricted = () => {
  const items = [
    {
      id: "item-rest-left",
      item: "restricted left only",
      style: { width: "10rem", height: "1rem", marginLeft: "92px" },
      restrictions: {
        self: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-right",
      item: "restricted right only",
      style: { width: "12rem", height: "1.5rem", marginLeft: "22px" },
      restrictions: {
        self: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: false,
        },
      },
    },
    {
      id: "item-rest-left-right",
      item: "restricted left & right only",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
      restrictions: {
        self: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: false,
        },
      },
    },
    {
      id: "item-rest-top",
      item: "restricted top only",
      style: { width: "10rem", height: "1rem", marginLeft: "92px" },
      restrictions: {
        self: {
          allowLeavingFromTop: false,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-bottom",
      item: "restricted bottom only",
      style: { width: "12rem", height: "1.5rem", marginLeft: "22px" },
      restrictions: {
        self: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: false,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-top-bottom",
      item: "restricted top & bottom only",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
      restrictions: {
        self: {
          allowLeavingFromTop: false,
          allowLeavingFromBottom: false,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-all",
      item: "restricted all",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
      restrictions: {
        self: {
          allowLeavingFromTop: false,
          allowLeavingFromBottom: false,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: false,
        },
      },
    },
  ];

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <ul>
          {items.map(({ id, style, item, ...rest }) => (
            <RestrictedItem
              key={id}
              id={id}
              style={style}
              title={item}
              {...rest}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Restricted;
