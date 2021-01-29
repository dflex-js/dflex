import React from "react";

const Container = ({
  component: ContainerComponent = "div",
  children,
  ...rest
}) => {
  return <ContainerComponent {...rest}>{children}</ContainerComponent>;
};

export default Container;
