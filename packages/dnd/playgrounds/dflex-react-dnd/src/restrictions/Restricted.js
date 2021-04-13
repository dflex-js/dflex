import React from "react";
import "./Restriction.css";

import { store, DnD } from "@dflex/dnd";

const Item = ({ id: idProps, children, style }) => {
  let mouseEvents;
  let dnd;

  let draggedID;

  const onMouseUp = (e) => {
    if (e.target && draggedID) {
      mouseEvents.forEach(({ evType, evTarget, handler }) => {
        evTarget.removeEventListener(evType, handler);
      });

      dnd.endDragging();

      // e.target.style.background = "whitesmoke";
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

        dnd = new DnD(
          id,
          { x: clientX, y: clientY },
          {
            restrictions: {
              allowLeavingFromTop: false,
              allowLeavingFromBottom: false,
              allowLeavingFromLeft: false,
              allowLeavingFromRight: false,
            },
          }
        );

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
    <li
      ref={ref}
      key={idProps}
      id={idProps}
      style={style}
      onMouseDown={onMouseDown}
    >
      {children}
    </li>
  );
};

const Restricted = () => {
  return (
    <div className="list-restriction-container">
      <ul id="p">
        <Item
          id="item-rest-1"
          style={{ width: "10rem", height: "3rem", marginLeft: "92px" }}
        >
          {1}
        </Item>
        <Item
          id="item-rest-2"
          style={{ width: "12rem", height: "3.5rem", marginLeft: "22px" }}
        >
          {2}
        </Item>
        <Item
          id="item-rest-3"
          style={{ width: "16rem", height: "2rem", marginLeft: "32px" }}
        >
          {3}
        </Item>
        <Item
          id="item-rest-4"
          style={{ width: "13rem", height: "4rem", marginLeft: "12px" }}
        >
          {4}
        </Item>
        <Item id="item-rest-5" style={{ width: "18rem", height: "1rem" }}>
          {5}
        </Item>
      </ul>
    </div>
  );
};

export default Restricted;
