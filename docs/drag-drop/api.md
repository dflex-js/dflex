---
title: DFlex Drag and Drop API
description: "DFlex Drag and Drop API"
---

## Installation

```bash
npm install @dflex/dnd
```

## API

DFlex DnD depends on three principles to achieve DOM interactivity:

- Register element in the store.
- Start dragging when mouse is down.
- End dragging to release element when mouse is up.

```js
import { store, DnD } from "@dflex/dnd";
```

### Register element

Each element should be registered in DFlex DnD Store in order to be active for drag
and drop later.

```ts
store.register(RegisterInputOpts): void;
```

Where `RegisterInputOpts` is an object with the following properties:

- `id: string` Targeted element-id.
- `depth?: number` The depth of targeted element starting from zero (The default value is zero).
- `readonly?: boolean` True for elements that won't be transformed during DnD
  but belongs to the same interactive container.

### Create Drag and Drop Session

The responsive drag and drop session should be created when `onmousedown` is
fired. So it can initialize the element and its siblings before start dragging.

```ts
const dflexDnD = new DnD(id, coordinate, opts);
```

- `id: string` registered element-id in the store.
- `coordinate: AxesPoint` is an object with `{x: number, y: number}` contains the coordinates of the
  mouse/touch click.
- `opts?: DFlexDnDOpts` is DnD options object. You can see [DFlex DnD options
  full documentation by clicking here.](#options)

### Start responsive dragging

```ts
dflexDnD.dragAt(x, y);
```

- `x: number` is event.clientX, the horizontal click coordinate.
- `y: number` is event.clientY, the vertical click coordinate.

### End Drag and Drop Session

```ts
dflexDnD.endDragging();
```

### Cleanup element

It's necessary to cleanup the element from store when the element won't be used
or will be removed/unmounted from the DOM to prevent any potential memory leaks.

```ts
store.unregister(id: string): void
```

## Options

You can pass options when creating a DnD instance that controls each element
individually. So your options can be different from each other.

### Dragging Threshold

The threshold object defines when the dragging event should be fired and
triggers the response of other sibling elements.

#### Threshold Interface

```ts
interface ThresholdPercentages {
  /** vertical threshold in percentage from 0-100 */
  vertical: number;

  /** horizontal threshold in percentage from 0-100 */
  horizontal: number;
}
```

#### Threshold Definition

```ts
interface DFlexDnDOpts {
  // ... other options.
  threshold?: Partial<ThresholdPercentages>;
}
```

#### Threshold Default Value

```json
{
  "threshold": {
    "vertical": 60,
    "horizontal": 60
  }
}
```

### Commit changes to DOM

DFlex is built to manipulate DOM elements with transformation indefinitely. This
means you can always drag and drop elements without reconstruction of the DOM.
Still, it comes with a reconciler that tracks elements' changes and only
reconciles the elements that have changed their position from their origin.

#### Commit Interface

```ts
interface CommitInterface {
  enableAfterEndingDrag: boolean;
  enableForScrollOnly: boolean;
}
```

#### Commit Definition

```ts
interface DFlexDnDOpts {
  // ... other options.
  commit?: Partial<CommitInterface>;
}
```

#### Commit Default Value

```json
{
  "commit": {
    "enableAfterEndingDrag": true,
    "enableForScrollOnly": true
  }
}
```

### Dragging Restrictions

You can define the dragging restrictions for each element relative:

1. Element position.
2. Element parent container.
3. Screen viewport (automatically enabled).

#### Restrictions Interface

```ts
interface Restrictions {
  self: {
    allowLeavingFromTop: boolean;
    allowLeavingFromBottom: boolean;
    allowLeavingFromLeft: boolean;
    allowLeavingFromRight: boolean;
  };
  container: {
    allowLeavingFromTop: boolean;
    allowLeavingFromBottom: boolean;
    allowLeavingFromLeft: boolean;
    allowLeavingFromRight: boolean;
  };
}
```

#### Restrictions Definition

```ts
interface DFlexDnDOpts {
  // ... other options.
  restrictions?: {
    self?: Partial<Restrictions["self"]>;
    container?: Partial<Restrictions["container"]>;
  };
}
```

#### Restrictions Default Value

```json
{
  "restrictions": {
    "self": {
      "allowLeavingFromTop": true,
      "allowLeavingFromBottom": true,
      "allowLeavingFromLeft": true,
      "allowLeavingFromRight": true
    },
    "container": {
      "allowLeavingFromTop": true,
      "allowLeavingFromBottom": true,
      "allowLeavingFromLeft": true,
      "allowLeavingFromRight": true
    }
  }
}
```

### Auto-Scroll

#### Auto-Scroll Interface

```ts
interface ScrollOptions {
  enable?: boolean;
  initialSpeed?: number;
  threshold?: Partial<ThresholdPercentages>;
}
```

#### Auto-Scroll Definition

```ts
interface DFlexDnDOpts {
  // ... other options.
  scroll?: Partial<ScrollOptions>;
}
```

#### Auto-Scroll Default Value

```json
{
  "scroll": {
    "enable": true,
    "initialSpeed": 10,
    "threshold": {
      "vertical": 15,
      "horizontal": 15
    }
  }
}
```

## Events

DFlex has three (3) types of [custom
events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

1. [DFlex Dragged Event.](#dragged-event)
2. [DFlex Interactivity Event.](#interactivity-event)
3. [DFlex Siblings Event.](#siblings-event)

### Event Usage

```js
// DFlex event handler.
const onDFlexEvent = (e: DFlexEvents) => {
  // Do something.
  console.log(`onDFlexEvent: ${e.type}`, e.detail);
};

// Dragged Events.
const ON_OUT_CONTAINER = "$onDragOutContainer";
const ON_OUT_THRESHOLD = "$onDragOutThreshold";

//  Interactivity Events.
const ON_DRAG_OVER = "$onDragOver";
const ON_DRAG_LEAVE = "$onDragLeave";

// Sibling Events.
const ON_LIFT_UP = "$onLiftUpSiblings";
const ON_MOVE_DOWN = "$onMoveDownSiblings";

// Capture DFlex event.
document.addEventListener(
  ON_OUT_CONTAINER /** or another event */,
  onDFlexEvent
);

// Remove it later when dragging is done.
document.removeEventListener(
  ON_OUT_CONTAINER /** or another event */,
  onDFlexEvent
);
```

### Dragged Event

It's an event related to capturing dragged positions. This event is fired when
the dragged is out of its threshold position `$onDragOutContainer` or out of its
container `$onDragOutThreshold`.

#### DraggedEvent interface

```ts
interface PayloadDraggedEvent {
  /** Returns element id in the registry  */
  id: string;

  /** Returns dragged temp index */
  index: number;
}

/** For dragged out of threshold or container event. */
type DFlexDraggedEvent = CustomEvent<PayloadDraggedEvent>;
```

#### Interactivity Event

It's an event related to capturing dragged interactions with other elements.
This event is fired when the dragged is over another element `$onDragOver` or
when the dragged is leaving the occupied position `$onDragLeave`.

##### InteractivityEvent interface

```ts
interface PayloadInteractivityEvent {
  /** Returns element id in the registry  */
  id: string;

  /** Returns element current index */
  index: number;

  /** Returns the element that triggered the event  */
  target: HTMLElement;
}

/** For dragged over an element or leaving an element. */
type DFlexInteractivityEvent = CustomEvent<PayloadInteractivityEvent>;
```

#### Siblings Event

It's an event related to capturing siblings' positions. This event is fired when
the siblings are lifting up `$onLiftUpSiblings` or moving down `$onMoveDownSiblings`

##### SiblingsEvent interface

```ts
interface PayloadSiblingsEvent {
  /** Returns the index where the dragged left  */
  from: number;

  /** Returns the last index effected of the dragged leaving/entering  */
  to: number;

  /** Returns an array of sibling ids in order  */
  siblings: string[];
}

/** When dragged movement triggers the siblings up/down. */
type DFlexSiblingsEvent = CustomEvent<PayloadSiblingsEvent>;
```

## Listeners

DFlex listeners are more generic than the custom events and responsible for
monitoring the entire layout and reporting back to you.

DFlex has two (2) types of listeners:

1. [Layout state listener.](#layout-state-listener)
2. [Mutation listener.](#mutation-listener)

### Listener Usage

```js
// app/index.js

const unsubscribeLayout = store.listeners.subscribe((e) => {
  console.info("new layout state", e);
}, "layoutState");

// call it later for clear listeners from memory.
unsubscribeLayout();

const unsubscribeMutation = store.listeners.subscribe((e) => {
  console.info("new mutation state", e);
}, "mutation");

// call it later for clear listeners from memory.
unsubscribeMutation();
```

### Layout state listener

Responsible for monitoring any change that happens to layout interactivity.

#### Layout state listener interface

```ts
type LayoutState =
  | "pending" // when DnD is initiated but not activated yet.
  | "ready" // When clicking over the registered element. The element is ready but not being dragged.
  | "dragging" // as expected.
  | "dragEnd" // as expected.
  | "dragCancel"; // When releasing the drag without settling in the new position.

interface DFlexLayoutStateEvent {
  type: "layoutState";
  status: LayoutState;
}
```

### Mutation listener

Responsible for monitoring DOM mutation that happens during reconciliation.

#### Mutation listener interface

```ts
type ElmMutationType = "committed";

interface DFlexElmMutationEvent {
  type: "mutation";
  status: ElmMutationType;
  payload: {
    target: HTMLElement; // HTML element container.
    ids: string[]; // Committed Elements' id in order.
  };
}
```

## Advanced

### getSerializedElm

DFlex elements are serialized and exported accordingly.

```ts
store.getSerializedElm(elmID: string): DFlexSerializedElement | null

type DFlexSerializedElement = {
  type: string;
  version: number;
  id: string;
  translate: PointNum | null;
  grid: PointNum;
  order: DFlexDOMGenOrder;
  initialPosition: AxesPoint;
  rect: BoxRectAbstract;
  hasTransformedFromOrigin: boolean;
  hasPendingTransformation: boolean;
  isVisible: boolean;
};
```

### getSerializedScrollContainer

DFlex scroll containers are serialized and exported accordingly. You can get any
scroll container for any registered element id.

```ts
store.getSerializedScrollContainer(elmID: string): DFlexSerializedScroll | null

type DFlexSerializedScroll = {
  type: string;
  version: number;
  key: string;
  hasOverFlow: AxesPoint<boolean>;
  hasDocumentAsContainer: boolean;
  scrollRect: AbstractBox;
  scrollContainerRect: AbstractBox;
  invisibleDistance: AbstractBox;
  visibleScreen: Dimensions;
};
```

### commit

Commit changes to the DOM. `commit` will always do surgical reconciliation. and
it's the same function that's used in the [options](#commit-changes-to-dom)

```ts
store.commit(): void
```

### isLayoutAvailable

True when DFlex is not transforming any elements and not executing any task.

```ts
isLayoutAvailable(): boolean
```

### unregister

safely removing element from store.

```ts
store.unregister(id: string): void
```

### destroy

To destroy all DFlex instances. This is what you should do when you are done
with DnD completely and your app is about to be closed.

```ts
store.destroy(): void;
```
