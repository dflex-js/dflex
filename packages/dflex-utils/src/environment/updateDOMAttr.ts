function updateDOMAttr<T>(DOM: HTMLElement, name: T, remove: boolean): void {
  const attrName = `data-${name}`;

  if (remove) {
    if (__DEV__) {
      if (!DOM.hasAttribute(attrName)) {
        throw new Error(`Attribute ${attrName} does not exist on the element.`);
      }

      DOM.removeAttribute(attrName);
    }

    return;
  }

  DOM.setAttribute(attrName, "true");
}

export default updateDOMAttr;
