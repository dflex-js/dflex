let idCounter = 0;

/**
 * Creates DOM element
 *
 * @param {Object} { type = "div", id: argID, children }
 * @returns - {Object} { element, id };
 */
function createElement({ type = "div", id: argID, children, ...rest } = {}) {
  const element = document.createElement(type);

  let id;
  if (argID) {
    id = argID;
  } else {
    id = `id-${idCounter}`;
    idCounter += 1;
  }

  element.setAttribute("id", id);

  if (children) {
    if (Array.isArray) {
      children.forEach((child) => {
        element.appendChild(child);
      });
    } else {
      element.appendChild(children);
    }
  } else {
    const newContent = document.createTextNode("Hello!");
    element.appendChild(newContent);
  }

  if (rest) {
    Object.keys(rest).forEach((ky) => {
      Object.assign(element, { [ky]: rest[ky] });
    });
  }
  return { element, id };
}

module.exports = { createElement };
