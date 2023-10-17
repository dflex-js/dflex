/**
 * Layout State:
 * - 'pending': when DnD is initiated but not activated yet.
 */
const PENDING = "pending";

/**
 * Layout State:
 * - 'ready': When clicking over the registered element. The element is ready but not being dragged.
 */
const READY = "ready";

/**
 * Layout State:
 * - 'dragging': as expected.
 */
const DRAGGING = "dragging";

/**
 * Layout State:
 * - 'dragEnd': as expected.
 */
const DRAG_END = "dragEnd";

/**
 * Layout State:
 * - 'dragCancel': When releasing the drag without settling in the new position.
 */
const DRAG_CANCEL = "dragCancel";

const LayoutStates = {
  PENDING,
  READY,
  DRAGGING,
  DRAG_END,
  DRAG_CANCEL,
} as const;

const COMMITTED = "committed";

const MutationStates = {
  COMMITTED,
} as const;

const { freeze } = Object;

freeze(LayoutStates);
freeze(MutationStates);

export { LayoutStates, MutationStates };
