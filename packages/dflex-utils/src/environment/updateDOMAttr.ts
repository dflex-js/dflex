function updateDOMAttr<T extends string>(
  DOM: HTMLElement,
  name: T,
  isRemove: boolean,
  value: string | undefined = "true",
): void {
  // Keep dragged attribute as is.
  const attrName = name === "dragged" ? name : `data-${name}`;

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

export default updateDOMAttr;
