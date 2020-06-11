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

    if (element) this.initOffset();
  }

  /**
   * Initializes the element offset only when it's called. Since it is sorting
   * different numbers related to transformation we don't need to invoke for
   * idle element because it's costly.
   *
   * So, basically any working element in DnD should be initiated first.
   *
   * @memberof AbstractCoreInstance
   */
  initOffset() {
    const { height, width, left, top } = this.elm.getBoundingClientRect();

    /**
     * Element offset stored once without being triggered to re-calculate.
     * Instead, using currentOffset object as indicator to current
     * offset/position. This offset, is the init-offset.
     */
    this.offset = {
      height,
      width,

      left,
      right: left + width,

      top,
      bottom: top + height,
    };

    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     */
    this.translateY = 0;
    this.translateX = 0;
    this.prevTranslateY = 0;
    this.prevTranslateX = 0;

    /**
     * This offset related directly to translate Y and Y. It's isolated from
     * element current offset and effects only top and left.
     */
    this.currentTop = top + this.translateY;
    this.currentLeft = left + this.translateX;
  }
}

export default AbstractCoreInstance;
