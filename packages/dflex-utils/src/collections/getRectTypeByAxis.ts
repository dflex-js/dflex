import { Axis } from "../types";

const WIDTH = "width";
const HEIGHT = "height";

const LEFT = "left";
const TOP = "top";

function getDimensionTypeByAxis(axis: Axis) {
  return axis === "x" ? WIDTH : HEIGHT;
}

function getDirectionTypeByAxis(axis: Axis) {
  return axis === "x" ? LEFT : TOP;
}

export { getDimensionTypeByAxis, getDirectionTypeByAxis };
