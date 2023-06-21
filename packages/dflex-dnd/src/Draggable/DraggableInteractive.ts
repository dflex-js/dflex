import {
  AbstractDFlexCycle,
  assertElmPos,
  featureFlags,
  PointNum,
  updateElmDatasetGrid,
} from "@dflex/utils";
import type { AxesPoint } from "@dflex/utils";

import { store } from "../LayoutManager";

import type { ScrollOpts, FinalDndOpts, Commit } from "../types";

import DraggableAxes from "./DraggableAxes";

function throwIfElmIsEmpty(siblings: string[]) {
  const maxLength = 10; // Maximum number of siblings to include in the error message

  if (siblings.some((item) => typeof item !== "string" || item.length === 0)) {
    let errorMessage = "throwIfElmIsEmpty: Siblings contain empty string";

    const validSiblings = siblings.filter((item) => typeof item === "string");
    if (validSiblings.length > maxLength) {
      const remainingSiblings = validSiblings.length - maxLength;
      const displayedSiblings = validSiblings.slice(0, maxLength).join(", ");
      errorMessage += `. Displaying first ${maxLength} siblings: ${displayedSiblings}, and ${remainingSiblings} more.`;
    } else {
      errorMessage += `: ${validSiblings.join(", ")}`;
    }

    throw new Error(errorMessage);
  }
}

function throwWhenDuplicates(siblings: string[]) {
  const duplicates = siblings.filter(
    (elem, index) => siblings.indexOf(elem) !== index
  );

  if (duplicates.length > 0) {
    throw new Error(
      `Siblings ${JSON.stringify(
        siblings
      )} contains non-unique elements. Duplicate elements found: ${JSON.stringify(
        duplicates
      )}`
    );
  }
}

function throwWhenCollision(siblings: string[]) {
  const positions = new Set();

  for (let i = 0; i < siblings.length; i += 1) {
    const id = siblings[i];

    const { rect } = store.registry.get(id)!;

    if (positions.has(rect)) {
      throw new Error(`throwWhenCollision: found collision in ${id}-element`);
    }

    positions.add(rect);
  }
}

function throwIfOutContainer(siblings: string[]) {
  for (let i = 0; i < siblings.length; i += 1) {
    const id = siblings[i];

    const {
      rect,
      _keys: { SK },
    } = store.registry.get(id)!;

    const container = store.containers.get(SK)!;

    const boundaries = container._getBoundaries();

    if (
      rect.right < boundaries.left ||
      rect.bottom < boundaries.top ||
      rect.left > boundaries.right ||
      rect.top > boundaries.bottom
    ) {
      throw new Error(
        `throwIfOutContainer: element ${id} is outside its container.`
      );
    }
  }
}

function triggerAssertProcess(
  DOM: HTMLElement,
  siblings: string[],
  grid: PointNum
) {
  updateElmDatasetGrid(DOM, grid);

  throwIfElmIsEmpty(siblings);
  throwWhenDuplicates(siblings);
  throwWhenCollision(siblings);
  throwIfOutContainer(siblings);
}

class DraggableInteractive extends DraggableAxes {
  mirrorDOM: HTMLElement | null;

  scroll: ScrollOpts;

  enableCommit: Commit;

  occupiedPosition: PointNum;

  occupiedTranslate: PointNum;

  constructor(id: string, initCoordinates: AxesPoint, opts: FinalDndOpts) {
    super(id, initCoordinates, opts);

    this.mirrorDOM = null;

    this.scroll = { ...opts.scroll };

    this.enableCommit =
      this.containersTransition.enable &&
      store.getElmSiblingsByKey(this.draggedElm._keys.SK).length > 1
        ? { ...opts.commit }
        : {
            enableAfterEndingDrag: false,
            enableForScrollOnly: false,
          };

    const [scroll] = store.getScrollWithSiblingsByID(id);

    const { rect, _translate: translate } = this.draggedElm;

    const { _hasOverflow: hasOverflow } = scroll;

    // Override the default options When no siblings or no overflow.
    if (hasOverflow.isAllFalsy()) {
      this.scroll.enable = false;
    }

    if (this.scroll.enable) {
      this.isViewportRestricted = false;

      // Initialize all the scroll containers in the same depth to enable migration.
      if (opts.containersTransition.enable) {
        store.getSiblingKeysByDepth(this.draggedElm._depth).forEach((SK) => {
          store.scrolls.get(SK)!._setInnerThreshold();
        });
      }

      const draggedDOM = store.interactiveDOM.get(this.draggedElm._id)!;

      this.mirrorDOM = draggedDOM.cloneNode(true) as HTMLElement;

      const initPos = this.draggedElm._getInitialPosition();

      const viewportPos = scroll._getElmViewportPosition(initPos.y, initPos.x);

      this._setDOMAttrAndStyle(
        this.draggedDOM,
        this.mirrorDOM,
        true,
        false,
        this.draggedElm._getDimensions(draggedDOM),
        viewportPos
      );

      this.draggedDOM.parentNode!.insertBefore(this.mirrorDOM, this.draggedDOM);
      this.draggedDOM = this.mirrorDOM;
    } else {
      this._setDOMAttrAndStyle(this.draggedDOM, null, true, false, null, null);
    }

    this.occupiedPosition = new PointNum(rect.left, rect.top);
    this.occupiedTranslate = new PointNum(translate.x, translate.y);
  }

  /**
   * Update the position of the dragged element and assign the new position to
   * migration handler.
   *
   * @param index
   */
  setDraggedTempIndex(index: number) {
    if (!Number.isNaN(index)) {
      store.migration.setIndex(index);
    }

    const draggedDOM = store.interactiveDOM.get(this.draggedElm._id)!;

    this.draggedElm._setAttribute(draggedDOM, "INDEX", index);
  }

  /**
   * Handle all the instances related to dragged ending process.
   *
   * @param isFallback
   * @param  latestCycle
   * @param  willReconcile
   * @returns
   */
  setDraggedTransformProcess(
    isFallback: boolean,
    latestCycle: AbstractDFlexCycle,
    willReconcile: boolean
  ) {
    const { SK, index } = latestCycle;
    const {
      rect,
      _translate: translate,
      _id: id,
      _VDOMOrder: VDOMOrder,
      _DOMGrid: DOMGrid,
    } = this.draggedElm;
    const siblings = store.getElmSiblingsByKey(SK);

    // Get the original DOM to avoid manipulating the mirror/ghost DOM.
    const draggedDOM = store.interactiveDOM.get(id)!;

    const hasToUndo =
      isFallback ||
      // dragged in position but has been clicked.
      this.occupiedPosition.isEqual(rect.left, rect.top);

    if (hasToUndo) {
      /**
       * There's a rare case where dragged leaves and returns to the same
       * position. In this case, undo won't be triggered so that we have to do
       * it manually here. Otherwise, undoing will handle repositioning. I
       * don't like it but it is what it is.
       */
      if (siblings[VDOMOrder.self] !== id) {
        this.draggedElm._assignNewIndex(siblings, VDOMOrder.self);
      }

      // If it didn't move, then do nothing.
      if (translate.isInstanceEqual(this._translatePlaceholder)) {
        return;
      }

      this.draggedElm._restorePosition(draggedDOM);

      if (__DEV__) {
        triggerAssertProcess(draggedDOM, siblings, DOMGrid);
      }

      return;
    }

    this.draggedElm.rect._setAxes(
      this.occupiedPosition.x,
      this.occupiedPosition.y
    );

    if (__DEV__) {
      if (featureFlags.enablePositionAssertion) {
        setTimeout(() => {
          assertElmPos(draggedDOM, this.draggedElm.rect);
        }, 1000);
      }
    }

    DOMGrid.clone(this.gridPlaceholder);

    VDOMOrder.self = index;

    this.draggedElm._assignNewIndex(siblings, index);

    // If it's going to reconcile to the DOM then there's no need to update the
    // transformation here.
    if (!willReconcile) {
      this.draggedElm._assignNewPosition(draggedDOM, this.occupiedTranslate);
    }

    if (__DEV__) {
      triggerAssertProcess(draggedDOM, siblings, DOMGrid);
    }
  }

  /**
   *
   * @param isFallback
   * @param isMigratedInScroll
   * @param latestCycle
   * @param willReconcile
   */
  cleanup(
    isFallback: boolean,
    isMigratedInScroll: boolean,
    latestCycle: AbstractDFlexCycle,
    willReconcile: boolean
  ) {
    const draggedDOM = store.interactiveDOM.get(this.draggedElm._id)!;

    if (isMigratedInScroll) {
      this._setDOMAttrAndStyle(
        draggedDOM,
        this.mirrorDOM!,
        false,
        true,
        this.draggedElm._getDimensions(draggedDOM),
        null
      );
    } else {
      this._setDOMAttrAndStyle(
        draggedDOM,
        this.mirrorDOM!,
        false,
        false,
        null,
        null
      );
    }

    this._appendDraggedToContainerDimensions(false);

    this.setDraggedTransformProcess(isFallback, latestCycle, willReconcile);

    this.threshold.destroy();
  }
}

export default DraggableInteractive;
