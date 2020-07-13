import { createElement, getBoundingClientRect } from "./funcs";

const childInstance1 = createElement({ getBoundingClientRect });
childInstance1.depth = 0;

const childInstance2 = createElement({ getBoundingClientRect });
childInstance2.depth = 0;

const parentInstance = createElement({
  children: [childInstance1.element, childInstance2.element],
  getBoundingClientRect,
});
parentInstance.depth = 1;

module.exports = {
  childInstance1,
  childInstance2,
  parentInstance,
};
