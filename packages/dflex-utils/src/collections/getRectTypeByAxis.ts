import { Axis } from "../types";
import { HEIGHT, LEFT, TOP, WIDTH, RIGHT, BOTTOM } from "../constants";

function getDimensionTypeByAxis(axis: Axis) {
  return axis === "x" ? WIDTH : HEIGHT;
}

function getStartingPointByAxis(axis: Axis) {
  return axis === "x" ? LEFT : TOP;
}

function getEndingPointByAxis(axis: Axis) {
  return axis === "x" ? RIGHT : BOTTOM;
}

function getOppositeAxis(axis: Axis): Axis {
  return axis === "x" ? "y" : "x";
}

export {
  getDimensionTypeByAxis,
  getStartingPointByAxis,
  getEndingPointByAxis,
  getOppositeAxis,
};
