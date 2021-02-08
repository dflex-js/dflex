/**
 * This is the link (bridge) between the Store and element actions/classes.
 * Abstract is essential for Draggable & extended Store.
 */
class AbstractCoreInstance {
  ref: HTMLElement;

  id: string;

  depth: number = 0;

  translateY: number = 0;

  translateX: number = 0;

  /**
   * Creates an instance of AbstractCoreInstance.
   */
  constructor({
    ref,
    id,
    depth,
  }: {
    ref: HTMLElement;
    id: string;
    depth: number;
  }) {
    this.ref = ref;
    this.id = id;
    this.depth = depth;

    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     */
    this.translateY = 0;
    this.translateX = 0;
  }
}

export default AbstractCoreInstance;
