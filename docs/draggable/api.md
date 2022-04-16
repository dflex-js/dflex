---
title: Draggable API
description: "DFlex draggable installation and API."
---

> Dragging elements without interacting with other elements is the layout.

## Installation

```bash
npm install @dflex/draggable
```

## API

If you already read the [Drag and Drop API documentation](docs/drag-drop/ap),
you can skip this section. All the mechanisms are the same.

```js
import { store, Draggable } from "@dflex/draggable";
```

### Register element

Each element should be registered in draggable store in order to be dragged later.

```ts
store.register(RegisterInput);
```

Where `RegisterInput` is an object with the following properties:

- `id?: string` is a unique identifier for an element in the registry. Duplicate
  ids will cause confusion and prevent DnD from working properly.
- `ref?: HTMLElement` targeted DOM element. Should be provided if you haven't
  provided the id.

### Create dragging event

The dragging event should be created when `onmousedown` is fired. So you
initialized the element before start dragging.

```ts
const draggableEvent = new Draggable(id, clickCoordinates);
```

- `id: string` registered element-id in the store.
- `clickCoordinates` is an object with `{x: number, y: number}` contains the coordinates of the
  mouse/touch click.

### Start dragging

```ts
draggableEvent.dragAt(x, y);
```

- `x: number` is event.clientX, the horizontal click coordinate.
- `y: number` is event.clientY, the vertical click coordinate.

### End dragging

```ts
draggableEvent.endDragging();
```

### Cleanup element

It's necessary to cleanup the element from store when the element won't be used
or will be removed/unmounted from the DOM to prevent memory leaks.

```ts
store.unregister(id);
```

- `id: string` registered element-id.

### Add Custom Style

You can also control the few style properties that Draggable use when dragging
the registered element with the static property `draggedStyle`.

#### DraggedStyle Interface

```ts
interface DraggedStyle = {
  prop: string;
  dragValue: string;
  afterDragValue: string | null;
}[];
```

#### DraggedStyle Default Value

```js
const draggedStyle = [
  {
    prop: "position",
    dragValue: "relative",
    afterDragValue: "",
  },
  {
    prop: "zIndex",
    dragValue: "99",
    afterDragValue: "",
  },
  {
    prop: "userSelect",
    dragValue: "none",
    afterDragValue: "",
  },
];
```
