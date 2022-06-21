/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store } from "@dflex/dnd";

interface Props {
  component: string | React.JSXElementConstructor<any>;
  id: string;
  children: React.ReactNode;
  depth: number;
}

const Core = ({
  component: CoreComponent = "div",
  id,
  children,
  depth,
  ...rest
}: Props) => {
  const ref = React.useRef(null) as React.MutableRefObject<any>;

  React.useEffect(() => {
    if (ref.current) store.register({ id, depth, parentID: "" });
  }, [ref]);

  return (
    <CoreComponent ref={ref} key={id} id={id} {...rest}>
      {children}
    </CoreComponent>
  );
};

export default Core;
