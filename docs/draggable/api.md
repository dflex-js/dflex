---
title: Draggable API
description: "DFlex draggable installation and API"
---

## Installation

```bash
npm install @dflex/draggable
```

## API

DFlex Draggable depends on three principles to achieve DOM interactivity:

- Register element in the store.
- Start dragging when mouse is down.
- End dragging to release element when mouse is up.

```js
import { store, Draggable } from "@dflex/draggable";
```

### Register element

Each element should be registered in draggable store in order to be dragged later.

```ts
store.register(id: string);
```

### Create dragging instance

The dragging instance should be created when `onmousedown` is fired. So you
initialized the element before start dragging.

```ts
const dflexDraggable = new Draggable(id, clickCoordinates);
```

- `id: string` registered element-id in the store.
- `coordinate: AxesPoint` is an object with `{x: number, y: number}` contains the coordinates of the

### Start dragging

```ts
dflexDraggable.dragAt(x, y);
```

- `x: number` is event.clientX, the horizontal click coordinate.
- `y: number` is event.clientY, the vertical click coordinate.

### End dragging

```ts
dflexDraggable.endDragging();
```

### Cleanup element

It's necessary to cleanup the element from store when the element won't be used
or will be removed/unmounted from the DOM to prevent memory leaks.

```ts
store.unregister(id);
```

- `id: string` registered element-id.
