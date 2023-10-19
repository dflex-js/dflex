import {
  AbstractDFlexCycle,
  assertElmPos,
  featureFlags,
  PointNum,
  updateElmDatasetGrid,
  updateIndexAttr,
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
    (elem, index) => siblings.indexOf(elem) !== index,
  );

  if (duplicates.length > 0) {
    throw new Error(
      `Siblings ${JSON.stringify(
        siblings,
      )} contains non-unique elements. Duplicate elements found: ${JSON.stringify(
        duplicates,
      )}`,
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
      keys: { SK },
    } = store.registry.get(id)!;

    const container = store.containers.get(SK)!;

    const boundaries = container.getBoundaries();

    if (
      rect.right < boundaries.left ||
      rect.bottom < boundaries.top ||
      rect.left > boundaries.right ||
      rect.top > boundaries.bottom
    ) {
      throw new Error(
        `throwIfOutContainer: element ${id} is outside its container.`,
      );
    }
  }
}

function triggerAssertProcess(
  DOM: HTMLElement,
  siblings: string[],
  grid: PointNum,
) {
  updateElmDatasetGrid(DOM, grid);

  throwIfElmIsEmpty(siblings);
  throwWhenDuplicates(siblings);
  throwWhenCollision(siblings);
  throwIfOutContainer(siblings);
}

const NO_COMMIT = {
  enableAfterEndingDrag: false,
};

if (__DEV__) {
  Object.freeze(NO_COMMIT);
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

    const element = store.registry.get(id)!;

    const {
      keys: { SK },
    } = element;

    const siblings = store.getElmSiblingsByKey(SK);
    const depthSiblings = store.getSiblingKeysByDepth(this.draggedElm.depth);

    const hasSiblings = siblings.length > 1;
    const canTransitionInDepth = depthSiblings.length > 1;

    const useCommitFromOpts =
      hasSiblings || (this.containersTransition.enable && canTransitionInDepth);

    this.enableCommit = useCommitFromOpts ? { ...opts.commit } : NO_COMMIT;

    const scroll = store.getScrollByID(id);

    const { rect, translate } = this.draggedElm;

    // Override the default options When no siblings or no overflow.
    if (scroll.hasOverflow.isAllFalsy()) {
      this.scroll.enable = false;
    }

    if (this.scroll.enable) {
      this.isViewportRestricted = false;

      const draggedDOM = store.interactiveDOM.get(this.draggedElm.id)!;

      this.mirrorDOM = draggedDOM.cloneNode(true) as HTMLElement;

      const initPos = this.draggedElm.getInitialPosition();

      const viewportPos = scroll.getElmViewportPosition(initPos.y, initPos.x);

      this.setDOMAttrAndStyle(
        this.draggedDOM,
        this.mirrorDOM,
        true,
        this.draggedElm.getDimensions(draggedDOM),
        viewportPos,
      );

      this.draggedDOM.parentNode!.insertBefore(this.mirrorDOM, this.draggedDOM);
      this.draggedDOM = this.mirrorDOM;
    } else {
      this.setDOMAttrAndStyle(this.draggedDOM, null, true, null, null);
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

    const draggedDOM = store.interactiveDOM.get(this.draggedElm.id)!;

    updateIndexAttr(draggedDOM, index);
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
    willReconcile: boolean,
  ) {
    const { SK, index } = latestCycle;
    const { rect, translate, id, VDOMOrder, DOMGrid } = this.draggedElm;
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
        this.draggedElm.assignNewIndex(siblings, VDOMOrder.self);
      }

      // If it didn't move, then do nothing.
      if (translate.isInstanceEqual(this.translatePlaceholder)) {
        return;
      }

      this.draggedElm.restorePosition(draggedDOM);

      if (__DEV__) {
        triggerAssertProcess(draggedDOM, siblings, DOMGrid);
      }

      return;
    }

    this.draggedElm.rect.setAxes(
      this.occupiedPosition.x,
      this.occupiedPosition.y,
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

    this.draggedElm.assignNewIndex(siblings, index);

    // If it's going to reconcile to the DOM then there's no need to update the
    // transformation here.
    if (!willReconcile) {
      this.draggedElm.assignNewPosition(draggedDOM, this.occupiedTranslate);
    }

    if (__DEV__) {
      triggerAssertProcess(draggedDOM, siblings, DOMGrid);
    }
  }

  cleanup(
    isFallback: boolean,
    latestCycle: AbstractDFlexCycle,
    willReconcile: boolean,
  ): void {
    const draggedDOM = store.interactiveDOM.get(this.draggedElm.id)!;
    const mirrorElement = this.mirrorDOM || null;

    this.setDOMAttrAndStyle(draggedDOM, mirrorElement!, false, null, null);

    this.appendDraggedToContainerDimensions(false);

    this.setDraggedTransformProcess(isFallback, latestCycle, willReconcile);

    if (this.events) {
      this.events.cleanupAttr();
    }

    this.threshold.destroy();
  }
}

export default DraggableInteractive;
