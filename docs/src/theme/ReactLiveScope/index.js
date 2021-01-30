import React from "react";
import DFlexDraggable from "@dflex/draggable";
import DFlexDnD from "@dflex/dnd";
// import { store, DnD } from "@dflex/dnd/src";

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
  // store,
  // DnD,
};

export default ReactLiveScope;
