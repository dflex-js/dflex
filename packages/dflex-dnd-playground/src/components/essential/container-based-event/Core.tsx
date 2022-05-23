/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

// @ts-expect-error
import { keyGenerator } from "@folo/utils";

import { store } from "@dflex/dnd";

interface Props {
  component: string | React.JSXElementConstructor<any>;
  id: string;
  children: React.ReactNode;
  depth: number;
}

const Core = ({
  component: CoreComponent = "div",
  id: idProps,
  children,
  depth,
  ...rest
}: Props) => {
  const ref = React.useRef(null) as React.MutableRefObject<any>;

  const [id] = React.useState(
    idProps || `${keyGenerator(new Date().getTime())}`
  );

  // eslint-disable-next-line no-unused-vars
  const [isDragged, setIsDragged] = React.useState(false);

  // function onDragOver() {
  //   console.log("dragged is over the element!");

  //   if (!isDragged) setIsDragged(true);
  // }

  // function onDragLeave() {
  //   console.log("dragged is leaving the element!");
  // }

  // const handlers = { onDragOver, onDragLeave };

  React.useEffect(() => {
    if (ref.current) store.register({ id, ref: ref.current, depth });
  }, [ref]);

  return (
    <CoreComponent
      ref={ref}
      key={id}
      id={id}
      style={
        isDragged
          ? {
              background: "#bce6eb",
            }
          : {}
      }
      {...rest}
    >
      {children}
    </CoreComponent>
  );
};

export default Core;
