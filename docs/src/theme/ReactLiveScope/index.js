import React from "react";
import DFlexDraggable from "@dflex/draggable";
import DFlexDnD from "@dflex/dnd";

import Todo from "./todo";

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
  Todo,
};

export default ReactLiveScope;
