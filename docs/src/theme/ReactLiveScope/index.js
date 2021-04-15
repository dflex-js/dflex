/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { Draggable, store as DraggableStore } from "@dflex/draggable";
import { DnD, store as DNDStore } from "@dflex/dnd";

// Draggable live
import "./draggable.css";
import HandlerSVG from "./HandlerSVG";

// DnD live
import "./todo.css";

const ReactLiveScope = {
  React,
  HandlerSVG,
  Draggable,
  DnD,
  DNDStore,
  DraggableStore,
};

export default ReactLiveScope;
