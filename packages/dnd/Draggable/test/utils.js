import { createElement, getBoundingClientRect } from "dflex-utils-test";

const childInstance1 = createElement({ getBoundingClientRect });
childInstance1.depth = 0;

const childInstance2 = createElement({ getBoundingClientRect });
childInstance2.depth = 0;

const parentInstance = createElement({
  children: [childInstance1.element, childInstance2.element],
  getBoundingClientRect,
});
parentInstance.depth = 1;

export { childInstance1, childInstance2, parentInstance };
