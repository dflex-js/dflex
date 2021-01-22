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
