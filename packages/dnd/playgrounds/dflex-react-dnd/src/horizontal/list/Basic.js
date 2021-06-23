/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import "./Horizontal.css";

import { store, DnD } from "@dflex/dnd";

const Item = ({ id: idProps, children }) => {
  let mouseEvents;
  let dnd;

  let draggedID;

  const onMouseUp = (e) => {
    if (e.target && draggedID) {
      mouseEvents.forEach(({ evType, evTarget, handler }) => {
        evTarget.removeEventListener(evType, handler);
      });

      dnd.endDragging();

      e.target.style.background = "whitesmoke";
      e.target.style.transition = "none";
    }
  };

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;

    dnd.dragAt(clientX, clientY);
  };

  const onMouseDown = (e) => {
    const { target, button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      const { id } = target;

      if (id) {
        draggedID = id;

        dnd = new DnD(id, { x: clientX, y: clientY });

        target.style.background = "pink";
        target.style.transition = "opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s";

        mouseEvents = [
          { evType: "mousemove", evTarget: document, handler: onMouseMove },
          { evType: "mouseup", evTarget: document, handler: onMouseUp },
        ];

        mouseEvents.forEach(({ evType, evTarget, handler }) => {
          evTarget.addEventListener(evType, handler);
        });
      }
    }
  };

  const ref = React.createRef();

  React.useEffect(() => {
    setTimeout(
      // eslint-disable-next-line func-names
      () => {
        store.register({ id: idProps, ref: ref.current, depth: 0 });
      },
      0
    );
  }, []);

  return (
    <li ref={ref} key={idProps} id={idProps} onMouseDown={onMouseDown}>
      {children}
    </li>
  );
};

const Basic = () => {
  return (
    <div className="horizontal-container">
      <ul>
        <Item id="item-h-1">{1}</Item>
        <Item id="item-h-2">{2}</Item>
        <Item id="item-h-3">{3}</Item>
        <Item id="item-h-4">{4}</Item>
      </ul>
    </div>
  );
};

export default Basic;
