function updateDOMAttr<T extends string>(
  DOM: HTMLElement,
  name: T,
  isRemove: boolean,
  addPrefix: boolean = true,
  value: string | undefined = "true",
): void {
  // Keep dragged attribute as is.
  const attrName = addPrefix ? `data-${name}` : name;

  if (isRemove) {
    if (__DEV__) {
      if (!DOM.hasAttribute(attrName)) {
        throw new Error(`Attribute ${attrName} does not exist on the element.`);
      }

      DOM.removeAttribute(attrName);
    }

    return;
  }

  DOM.setAttribute(attrName, value);
}

function updateIndexAttr(DOM: HTMLElement, value: number): void {
  updateDOMAttr(DOM, "index", false, true, `${value}`);
}

export { updateDOMAttr, updateIndexAttr };
