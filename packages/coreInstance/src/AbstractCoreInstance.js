class AbstractCoreInstance {
  /**
   *
   * @param {string} id
   * @param {node} elm
   * @param {number} index - element self index
   */
  constructor({ id, element }) {
    this.id = id;
    this.elm = element;

    this.translateY = 0;
    this.translateX = 0;
  }

  seTranslate(x, y) {
    this.translateY = y;
    this.translateX = x;
  }
}

export default AbstractCoreInstance;
