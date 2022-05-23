import React from "react";

interface Props {
  children: React.ReactNode;
  [x: string]: any;
}
const Container = ({ children, ...rest }: Props) => (
  <div {...rest}>{children}</div>
);

export default Container;
