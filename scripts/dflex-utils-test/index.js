let idCounter = 0;

/**
 * Creates DOM element
 *
 * @param {Object} { type = "div", id: argID, children }
 * @returns - {Object} { element, id };
 */
function createElement({ type = "div", id: argID, children }) {
  const newDiv = document.createElement(type);

  let id;
  if (argID) {
    id = argID;
  } else {
    id = `id-${idCounter}`;
    idCounter += 1;
  }

  newDiv.setAttribute("id", id);

  const newContent = children || document.createTextNode("Hello!");
  newDiv.appendChild(newContent);

  return { element: newDiv, id };
}

module.exports = createElement;
