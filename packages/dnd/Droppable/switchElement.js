function updateElement() {
  console.log("element should be updated");
  //   if (!this.isFoundBreakingPoint) {
  //     const { currentLeft: elmLeft, currentTop: elmTop } = element;
  //     const { currentLeft: draggedLeft, currentTop: draggedTop } = [DRAGGED_ELM];
  //     topDifference = Math.abs(elmTop - draggedTop);
  //     leftDifference = Math.abs(elmLeft - draggedLeft);
  //     isFoundBreakingPoint = true;
  //   }
  //   setThreshold(element);
  //   numberOfElementsTransformed += 1;
  //   draggedTempIndex =
  //     [DRAGGED_ELM].order.self - elemDirection * numberOfElementsTransformed;
  //   element.setYPosition(
  //     this.siblingsList,
  //     this.elemDirection,
  //     this.topDifference,
  //     1,
  //     true
  //   );
}

function isElemSwitchable(draggedIndex, { elmIndex, elmDirection }) {
  /**
   * If dragged is going up, next element is the element above, which means
   * its index is elmCurrentIndex -1 and vice versa when going down.
   *
   * nextElem = elmCurrentIndex +/- 1;
   */
  const nextElem = elmIndex + elmDirection;

  /**
   * Element is Switchable when it's directly is above/under dragged.
   */
  return nextElem === draggedIndex;
}

function switchElement(
  isLoopBreakable,
  draggedElement,
  elementsList,
  getElmById
) {
  const { id: draggedID } = draggedElement;

  /**
   * Using for because in some cases the loop is breakable.
   */
  for (let i = 0; i < elementsList.length; i += 1) {
    const id = elementsList[i];

    /**
     * Avoid dragged element.
     */
    if (id && id !== draggedID) {
      const element = getElmById(id);

      const {
        order: { self },
      } = element;

      const isQualified = isElemSwitchable(self);

      if (isQualified) {
        updateElement(element);

        if (isLoopBreakable) break;
      }
    }
  }
}
