import React from "react";

const Container = ({
  component: ContainerComponent = "div",
  children,
  ...rest
}) => <ContainerComponent {...rest}>{children}</ContainerComponent>;

export default Container;
