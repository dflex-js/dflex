---
id: introduction
title: Drag & Drop
sidebar_label: Introduction To Drag & Drop
description: Draggable and Drop component written in pure JS works for Web and Mobile
keywords:
  - draggable
  - drop
  - drag
  - JavaScript
  - DOM
  - dflex
---

> A Simple, lightweight Solution for a Drag & Drop App

DFlex DnD is written in pure JavaScript and can be used with different frameworks
whether it is React, Vue, Angular, etc.

It depends on animation, tracks each droppable area which makes the whole
process runs smoothly as much as possible.

## Installation

```bash
npm install @dflex/dnd
```

<p align="center">
 <img
  src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dnd/public/dnd.gif"
  alt="show how drag and drop works" />
</p>

<p align="center">
 <img src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dnd/public/dnd.png"
 alt="show drag and drop performance" />
</p>

## Features

- DOM elements are not re-ordered instead they are being transformed.

- Preserve continuity of the layout transformation.

- Minimal side effect, only effected elements are manipulated.

## API

You can achieve a drag and drop with three steps only:

- Register element in the store.
- Start dragging when mouse is down.
- End dragging to release element when mouse is up.

```js
import { store, DnD } from "@dflex/dnd";
```

### Register Element

Each element should be registered in DnD store in order to be active later

```ts
store.register({ id: String, element: HTMLElement, depth: Number });
```

- `id: String` is unique identifer for an element in the registry.
- `element: HTMLElement` targeted DOM element.
- `depth: Number` Element depth in tree. Start from bottom up. So child is `0`,
  parents are `1` so on so forth. The idea of depth is to be able to targeted
  multiple containers when you can move a child or a parent wrapper.

### Start Dragging

Use `onmousedown` to trigger responsive dragging

```ts
const { target, clientX, clientY } = event;

dnd = new DnD(target.id, { x: clientX, y: clientY });
```

### End dragging

Use `onmouseup` to end dragging

```ts
dnd.endDragging();
```

## Advanced

### Attach/Reattach Element Reference in the Store

To reattach DOM element reference in the store (usually when an element updated in
the screen):

```ts
store.reattachElmRef(id: string, elmRef: HTMLElement)
```

To detach DOM element reference in the store (usually when an element disappear
from the screen):

```ts
store.detachElmRef(id: string)
```

### Reset Element in the Store

To clear element from the registry. Should be called only when element is
unmounted and expected to return with different positions only. Otherwise, call
[detachElmRef](introduction#attachreattach-element-reference)

```ts
resetElm(id: string)
```

### Getting dragged Index

In case you need to know the current index of dragged element.

```ts
dnd.getDraggedTempIndex() : number
```

### Getting Current Order

To get current layout container order you can always do `getStatus`. Calling it
while dragging happens will return element order in an array with `null` in the
dragged index considering the dragged position is not settled yet.

```ts
dnd.getStatus() : Array|string
```
