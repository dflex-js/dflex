import React from "react";
import DFlexDraggable from "@dflex/draggable";

const DraggableStyle = {
  backgroundColor: "white",
  border: "solid red",
  borderRadius: 20,
  padding: 10,
  cursor: "pointer",
};

const ReactLiveScope = {
  React,
  ...React,
  DraggableStyle,
  DFlexDraggable,
};

export default ReactLiveScope;
