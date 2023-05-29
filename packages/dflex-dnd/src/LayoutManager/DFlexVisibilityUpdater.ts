import type { DFlexElement, DFlexScrollContainer } from "@dflex/core-instance";
import type { Siblings } from "@dflex/dom-gen";
import type DFlexDnDStore from "./DFlexDnDStore";

let prevVisibility = false;

function updateElmVisibility(
  DOM: HTMLElement,
  elm: DFlexElement,
  scroll: DFlexScrollContainer
): boolean {
  const { rect } = elm;

  const [isInvisible] = scroll.isElmOutViewport(
    rect.top,
    rect.left,
    rect.height,
    rect.width
  );

  const isBreakable = prevVisibility && isInvisible;

  const isVisible = !isInvisible;

  prevVisibility = isVisible;

  elm.changeVisibility(DOM, isVisible);

  return isBreakable;
}

function updateSiblingsVisibility(
  sibling: Siblings,
  store: DFlexDnDStore,
  from: number,
  to: number,
  value: boolean
): void {
  for (let i = from; i < to; i += 1) {
    const elmID = sibling[i];

    if (elmID.length > 0) {
      const [elm, DOM] = store.getElmWithDOM(elmID);

      elm.changeVisibility(DOM, value);
    }
  }
}

function updateSiblingsVisibilityLinearly(
  store: DFlexDnDStore,
  SK: string
): void {
  if (__DEV__) {
    const siblings = store.getElmSiblingsByKey(SK);

    if (siblings.length === 0) {
      throw new Error(
        `updateSiblingsVisibilityLinearly: No siblings found for the given key ${SK}.`
      );
    }

    const hsScroll = store.scrolls.has(SK);

    if (!hsScroll) {
      throw new Error(
        `updateSiblingsVisibilityLinearly: No scroll found for the given key ${SK}`
      );
    }
  }

  const siblings = store.getElmSiblingsByKey(SK);
  const scroll = store.scrolls.get(SK)!;

  // If not scroll, then all the elements are visible.
  if (scroll.allowDynamicVisibility) {
    let breakAt = 0;

    for (let i = 0; i < siblings.length; i += 1) {
      const elmID = siblings[i];

      if (elmID.length > 0) {
        const [elm, DOM] = store.getElmWithDOM(elmID);

        // isBreakable when the element is visible and the next element is not.
        const isBreakable = updateElmVisibility(DOM, elm, scroll);

        if (isBreakable) {
          breakAt = i;

          break;
        }
      }
    }

    // Is it breakable?
    if (breakAt > 0) {
      updateSiblingsVisibility(
        siblings,
        store,
        breakAt,
        siblings.length,
        false
      );
    }
  } else {
    updateSiblingsVisibility(siblings, store, 0, siblings.length, true);
  }

  // Resetting the flag.
  prevVisibility = false;
}

export default updateSiblingsVisibilityLinearly;
