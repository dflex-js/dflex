import React from "react";
import DFlexDraggable from "@dflex/draggable";

import "./index.css";
import HandlerSVG from "./HandlerSVG";

const ReactLiveScope = {
  React,
  ...React,
  HandlerSVG,
  DFlexDraggable,
};

export default ReactLiveScope;
