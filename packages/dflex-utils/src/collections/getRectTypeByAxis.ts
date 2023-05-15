import { Axis } from "../types";
import { HEIGHT, LEFT, TOP, WIDTH } from "../constants";

function getDimensionTypeByAxis(axis: Axis) {
  return axis === "x" ? WIDTH : HEIGHT;
}

function getDirectionTypeByAxis(axis: Axis) {
  return axis === "x" ? LEFT : TOP;
}

export { getDimensionTypeByAxis, getDirectionTypeByAxis };
