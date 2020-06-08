import React from "react";
import { keyGenerator } from "@folo/utils";

import store from "./Store";

let isDown = false;

const Core = props => {
  const {
    component: CoreComponent = "div",
    id: idProps,
    childIndex,
    children,
    depth,
    ...rest
  } = props;

  const ref = React.createRef();

  const [id] = React.useState(
    idProps || `${keyGenerator(new Date().getTime())}`
  );

  React.useEffect(() => {
    store.register({ id, ref, depth });
  }, []);

  const onMouseDown = e => {
    isDown = true;
  };

  const onMouseUp = e => {
    isDown = false;
  };

  const onMouseMove = e => {
    if (isDown) {
      // const x = e.target.getBoundingClientRect();
      // const { left, top } = x;
      // console.log("getBoundingClientRect left");
    }

    // const { top, left } = ref.current;
    // console.log("offset: Top, left:", top, left);
  };

  return (
    <CoreComponent
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      ref={ref}
      className="item"
      key={id}
      id={id}
      {...rest}
    >
      {children}
    </CoreComponent>
  );
};

export default Core;
