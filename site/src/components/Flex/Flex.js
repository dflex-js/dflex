import React from "react";

function Flex({
  Component = "div",
  children,
  direction = "row",
  grow = 0,
  shrink = 1,
  basis = "auto",
  justifyContent = "flex-start",
  alignItems = "flex-start",
}) {
  return (
    <Component
      css={{
        display: "flex",
        flexDirection: direction,
        flexGrow: grow,
        flexShrink: shrink,
        flexBasis: basis,
        justifyContent,
        alignItems,
      }}
    >
      {children}
    </Component>
  );
}

export default Flex;
