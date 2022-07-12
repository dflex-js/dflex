---
title: DFlex Drag and Drop API
description: "DFlex Drag and Drop API."
---

## Installation

```bash
npm install @dflex/dnd
```

## API

DFlex depends on three principles to achieve DOM interactivity:

- Register element in the store.
- Start dragging when mouse is down.
- End dragging to release element when mouse is up.

```js
import { store, DnD } from "@dflex/dnd";
```

### Register element

Each element should be registered in DnD store in order to be active for drag
and drop later.

```ts
store.register(RegisterInputOpts);
```

Where `RegisterInputOpts` is an object with the following properties:

- `id: string` Targeted element-id.
- `depth?: number` The depth of targeted element starting from zero (The default value is zero).
- `readonly?: boolean` True for elements that won't be transformed during DnD
  but belongs to the same interactive container.

### Create responsive DnD event

The responsive drag and drop event should be created when `onmousedown` is
fired. So it can initialize the element and its siblings before start dragging.

```ts
const dndEvent = new DnD(id, clickCoordinates, opts);
```

- `id: string` registered element-id in the store.
- `clickCoordinates` is an object with `{x: number, y: number}` contains the coordinates of the
  mouse/touch click.
- `opts?` is DnD options object. You can see [options full documentation by
  clicking here.](/docs/drag-drop/api/#options)

### Start responsive dragging

```ts
dndEvent.dragAt(x, y);
```

- `x: number` is event.clientX, the horizontal click coordinate.
- `y: number` is event.clientY, the vertical click coordinate.

### End DnD event

```ts
dndEvent.endDragging();
```

### Cleanup element

It's necessary to cleanup the element from store when the element won't be used
or will be removed/unmounted from the DOM to prevent memory leaks.

```ts
store.unregister(id);
```

- `id: string` registered element-id.

## Options

You can pass options when creating DnD event that controls each element
individually. So your options can be different for each element.

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
interface DndOpts {
  // ... other options.
  threshold?: Partial<ThresholdPercentages>;
}
```

#### Threshold Default Value

```js
{
  "threshold": {
    "vertical": 60,
    "horizontal": 60
  }
}
```

### Dragging Restrictions

You can define the dragging restrictions for each element relative to its
position or the parent container. Note that elements with no auto-scroll are
automatically restricted to the viewport.

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
interface DndOpts {
  // ... other options.
  restrictions?: {
    self?: Partial<Restrictions["self"]>;
    container?: Partial<Restrictions["container"]>;
  };
}
```

#### Restrictions Default Value

```js
{
  "restrictions": {
    "self": {
      "allowLeavingFromTop": true,
      "allowLeavingFromBottom": true,
      "allowLeavingFromLeft": true,
      "allowLeavingFromRight": true,
    },
    "container": {
      "allowLeavingFromTop": true,
      "allowLeavingFromBottom": true,
      "allowLeavingFromLeft": true,
      "allowLeavingFromRight": true,
    },
  },
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
interface DndOpts {
  // ... other options.
  scroll?: Partial<ScrollOptions>;
}
```

#### Auto-Scroll Default Value

```js
{
  "scroll": {
    "enable": true,
    "initialSpeed": 10,
    "threshold": {
      "vertical": 15, // vertical threshold in percentage from 0-100
      "horizontal": 15, // horizontal threshold in percentage from 0-100
    },
  },
}
```

### Events

There are four(4) categories of DnD custom events:
[DraggedEvent](#dragged-event), [InteractivityEvent](#interactivity-event),
[SiblingsEvent](#siblings-event) and [LayoutStateEvent](#layoutstate-event).

#### Events Definition

```ts
interface DndOpts {
  // ... other options.
  events?: Partial<Events>;
}
```

#### Events Interface

```ts
interface Events {
  /** Drag events  */
  onDragOutContainer: (event: DraggedEvent) => unknown;
  onDragOutThreshold: (event: DraggedEvent) => unknown;

  /** Interactivity events  */
  onDragOver: (event: InteractivityEvent) => unknown;
  onDragLeave: (event: InteractivityEvent) => unknown;

  /** Sibling events  */
  onLiftUpSiblings: (event: SiblingsEvent) => unknown;
  onMoveDownSiblings: (event: SiblingsEvent) => unknown;

  /** Layout events  */
  onStateChange: (layoutState: LayoutStateEvent) => unknown;
}
```

#### Dragged Event

It's an event related to the dragged element. This event is fired with
`onDragOutContainer` and `onDragOutThreshold` event listeners.

##### DraggedEvent interface

```ts
interface DraggedEvent {
  /** Returns the element that is being dragged */
  type: "onDragOutContainer" | "onDragOutThreshold";

  /** Returns the time at which the event was created  */
  timeStamp: number;

  /** Returns element id in the registry  */
  id: string;

  /** Returns dragged temp index */
  index: number;
}
```

#### Interactivity Event

It's an event related to elements that interacted with the dragged. This event
is fired with `onDragOver` and `onDragLeave` event listeners.

##### InteractivityEvent interface

```ts
interface InteractivityEvent {
  /** Returns the element that is being dragged */
  type: "onDragOver" | "onDragLeave";

  /** Returns the time at which the event was created  */
  timeStamp: number;

  /** Returns element id in the registry  */
  id: string;

  /** Returns element current index */
  index: number;

  /** Returns the element that triggered the event  */
  target: HTMLElement;
}
```

#### Siblings Event

It's an Events related to the active list/branch: siblings. This event
is fired `onLiftUpSiblings` and `onMoveDownSiblings` event listeners.

##### SiblingsEvent interface

```ts
interface SiblingsEvent {
  /** Returns the element that is being dragged */
  type: "onLiftUpSiblings" | "onMoveDownSiblings";

  /** Returns the time at which the event was created  */
  timeStamp: number;

  /** Returns the index where the dragged left  */
  from: number;

  /** Returns the last index effected of the dragged leaving/entering  */
  to: number;

  /** Returns an array of sibling ids in order  */
  siblings: Array<string>;
}
```

#### LayoutState Event

It's an Events related to the layout current phase. This event
is fired `onStateChange` event listeners.

##### LayoutStateEvent interface

```ts
type LayoutState =
  | "pending" // when DnD is initiated but not activated yet.
  | "ready" // When clicking over the registered element. The element is ready but not being dragged.
  | "dragging" // as expected.
  | "dragEnd" // as expected.
  | "dragCancel"; // When releasing the drag without settling in the new position.

interface LayoutStateEvent {
  /** Returns the element that is being dragged */
  type: "onStateChange";

  /** Returns the time at which the event was created  */
  timeStamp: number;

  /** Returns the current state of the interactive layout */
  layoutState: LayoutState;
}
```

## Advanced

### DnD Event API

#### getDraggedTempIndex

In case you need to know the current index of dragged element.

```ts
dndEvent.getDraggedTempIndex() : number
```

### Store Instance API

#### destroy

To cleanup the store from all registered elements. This is probably what you
should do when you are done with DnD completely or your app is about to be closed.

```ts
store.destroy(): void;
```

#### getELmTranslateById

In case you need to know the current translate value as it's stored in the store. This
is so much faster than using `getElementById` or `getComputedStyle` methods.

```ts
store.getELmTranslateById(id: string): {
  translateX: number;
  translateY: number;
};
```

#### getElmSiblingsById

The easiest and fastest way to get the siblings of an element in order.

```ts
store.getElmSiblingsById(id: string): string | Array<string> | null;
```

#### getInitialELmRectById

Returns the initial DOMRect object of the element.

```ts
getInitialELmRectById(id: string): Rect | undefined;
```

##### Rect Interface

```ts
interface Rect {
  height: number;
  width: number;
  left: number;
  top: number;
}
```

#### getElmTreeById

```ts
store.getElmTreeById(id: string) : ElmTree
```

##### ElmTree Interface

```ts
type ElmBranch = string | Array<string> | null;

interface ElmTree {
  element: CoreInstanceInterface;
  parent: CoreInstanceInterface | null;
  branches: {
    siblings: ElmBranch;
    parents: ElmBranch;
  };
}
```
