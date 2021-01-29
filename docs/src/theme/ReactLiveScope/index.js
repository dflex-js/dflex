import React from "react";
import DFlexDraggable from "@dflex/draggable";
// import DFlexDnD from "@dflex/dnd/src";
import { store, DnD } from "@dflex/dnd/src";

// Draggable live
import "./draggable.css";
import HandlerSVG from "./HandlerSVG";

// DnD live
import "./todo.css";

console.log("file: index.js ~ line 5 ~ store, DnD", store, DnD);

const ReactLiveScope = {
  React,
  ...React,
  HandlerSVG,
  DFlexDraggable,
  store,
  DnD,
};

export default ReactLiveScope;
