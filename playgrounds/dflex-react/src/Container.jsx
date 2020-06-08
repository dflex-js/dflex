/* eslint-disable no-use-before-define */
import React from "react";

// import Droppable from "./MouseSensors";

const containerRef = React.createRef();

const Container = ({
  component: ContainerComponent = "div",
  children,
  ...rest
}) => {
  let mouseEvents;

  let droppable;

  let draggedID = null;

  const onMouseDown = (e) => {
    const { target, button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      const { id } = target;

      if (id) {
        draggedID = id;

        // droppable = new Droppable(id, { x: clientX, y: clientY });

        const { current } = containerRef;

        mouseEvents = [
          { evType: "mousemove", evTarget: document, handler: onMouseMove },
          { evType: "mouseup", evTarget: document, handler: onMouseUp },
          { evType: "mouseover", evTarget: current, handler: onMouseOver },
          { evType: "mouseout", evTarget: current, handler: onMouseOut },
          // { e: "mouseleave", target, handler: onMouseLeave },
          // { e: "mouseenter", target, handler: onMouseEnter }
        ];

        mouseEvents.forEach(({ evType, evTarget, handler }) => {
          evTarget.addEventListener(evType, handler);
        });
      }
    }
  };

  const onMouseUp = (e) => {
    containerRef.current.style.background = "pink";
    if (draggedID) {
      droppable.endAll();

      mouseEvents.forEach(({ e, target, handler }) => {
        target.removeEventListener(e, handler);
      });
    }

    // console.log(store.lists[0].elements);
  };

  const onMouseOver = (e) => {
    const { id } = e.target;

    // console.log("in", e.target);

    // ? should i delete it or keep it?
    // if (!id || id === draggedID || id === hoveredID) return;
    // if (!id || id === draggedID) return;
    //
    // hoveredID = id;

    // console.log("hovered", id);

    // setTo(hoveredID);
  };

  const onMouseOut = (e) => {};

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;

    droppable.startDragging(clientX, clientY);
  };

  console.log("ContainerController update");

  return (
    <ContainerComponent onMouseDown={onMouseDown} ref={containerRef} {...rest}>
      {children}
    </ContainerComponent>
  );
};

export default Container;
