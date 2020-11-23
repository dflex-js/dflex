/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { keyGenerator } from "@folo/utils";
import { store } from "@dflex/dnd/src";

const DnDElement = (props) => {
  const {
    component: DnDComponent = "div",
    id: idProps,
    children,
    depth,
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
      0
    );
  }, [id, depth, ref]);

  return (
    <DnDComponent ref={ref} key={id} id={id}>
      {children}
    </DnDComponent>
  );
};

export default DnDElement;
