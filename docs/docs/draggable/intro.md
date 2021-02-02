---
id: introduction
title: Draggable
sidebar_label: Introduction To Draggable
description: Draggable component written in pure JS works for Web and Mobile
keywords:
  - draggable
  - JavaScript
  - DOM
  - dflex
---

> Draggable is a native utility written in pure JS works for Web and Mobile

DFlex draggable is the simplest solution to create JavaScript draggable
elements. No need for a special tutorial and thinking about implementation
complexity or even migration to different technologies for different frameworks.
It can be used with any app you have whether it is React, Vue, Angular or Svelte.

## Installation

```bash
npm install @dflex/draggable
```

<p align="center">
    <img
     src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/draggable/img/draggable.gif"
     alt="show how draggable works" />
</p>

## Features

- You can add strictly draggable, moving only horizontal or vertical by yourself
  because you control dragging coordinations.

- You can control the clickable area, simply because it's a mouse event. Could
  be on the entire element or a small button of the element. It's up to you.

- You know when the dragging is going to start and end without adding additional API functions.

- It can be nested dragging. Related to a list of elements or just one element It doesn't matter. It is always the same.

## API

```js
import { store, Draggable } from "@dflex/draggable";
```

### Registry

Register draggable element in draggable store:

```ts
store.register({ id: string, element: Node });
```

### Draggable Instance

Create draggable instance with `onmousedown`handler

```ts
const draggable = new Draggable(id: string, {x: event.clientX, y: event.clientY});
```

### Movement

Move the element with `onmousemove` handler

```ts
draggable.dragAt(event.clientX, event.clientY);
```

### End Dragging

You can end dragging with`onmouseup` handler

```ts
draggable.endDragging();
```

### Add Custom Style

While you can add style, classes related to drag since you trigger `dragAt` and `endDragging`.
You can also control the few style properties that Draggable use when dragging.

When create draggable Instance you can use `draggedStyle: Array<draggedStyleObj>`

```ts
draggedStyleObj: {
  prop: string;
  dragValue: string;
  afterDragValue:? string;
}
```

Default value for `draggedStyle`:

```js
const draggedStyle = [
  {
    prop: "zIndex",
    dragValue: "99",
    afterDragValue: null,
  },
];
```

You can change it after creating dragged instance. The following example
will change background color `red` during the drag and `purple` after finish dragging.

```js
draggable.draggedStyle = [
  {
    prop: "zIndex",
    dragValue: "99",
    afterDragValue: null,
  },
  {
    prop: "pointerEvents",
    dragValue: "pointer",
    afterDragValue: null,
  },
  {
    prop: "background",
    dragValue: "red",
    afterDragValue: "purple",
  },
];
```
