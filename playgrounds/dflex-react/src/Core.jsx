import React from "react";
import { keyGenerator } from "@folo/utils";

// eslint-disable-next-line import/no-unresolved
import { store } from "@dflex/draggable";

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
    setTimeout(
      // eslint-disable-next-line func-names
      function () {
        store.register({ id, element: ref.current, depth });
      },
      0,
      this
    );
  }, []);

  return (
    <CoreComponent ref={ref} key={id} id={id} {...rest}>
      {children}
    </CoreComponent>
  );
};

export default Core;
