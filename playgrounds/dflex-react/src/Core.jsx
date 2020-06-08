import React from "react";
import { keyGenerator } from "@folo/utils";

// import store from "./Store";

const Core = (props) => {
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
    // store.register({ id, ref, depth });
  }, []);

  return (
    <CoreComponent ref={ref} key={id} id={id} {...rest}>
      {children}
    </CoreComponent>
  );
};

export default Core;
