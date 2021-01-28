import React from "react";
import DFlexDraggable from "@dflex/draggable";
import DFlexDnD from "@dflex/dnd";

// Draggable live
import "./draggable.css";
import HandlerSVG from "./HandlerSVG";

// DnD live
import "./todo.css";

const ReactLiveScope = {
  React,
  ...React,
  HandlerSVG,
  DFlexDraggable,
  DFlexDnD,
};

export default ReactLiveScope;
