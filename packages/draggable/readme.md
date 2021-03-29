<h1 align="center">
  <img
  src="https://raw.githubusercontent.com/jalal246/dflex/master/dflex-full-size.png"
  alt="Dflex logo" />
</h1>

<p align="center">
  <a href="https://github.com/jalal246/dflex">
    <img
    src="https://img.shields.io/github/workflow/status/jalal246/dflex/Unit Test"
    alt="Dflex build status" />
  </a>
  <a href="https://github.com/jalal246/dflex/pulls">
    <img
    src="https://img.shields.io/github/issues-pr/jalal246/dflex"
    alt="number of opened pull requests"/>
  </a>
  <a href="https://github.com/jalal246/dflex/issues">
  <img
    src="https://img.shields.io/github/issues/jalal246/dflex"
    alt="number of opened issues"/>
  </a>
  <a href="https://github.com/jalal246/dflex/pulls">
   <img
   src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"
   alt="Dflex welcomes pull request" />
  </a>
</p>

# @dflex/draggable

> Draggable is a native utility written in pure JS works for Web and Mobile

DFlex draggable is the simplest solution to create JavaScript draggable
elements. No need for a special tutorial and thinking about implementation
complexity or even migration to different technologies for different frameworks.
It can be used with any app you have whether it is React, Vue, Angular or Svelte.

## Documentation

Visit DFlex site for more <https://jalal246.github.io/dflex/> and to see live
examples with the full code.

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
store.register({ id: string, ref: HTMLElement });
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

### Implementations

- [Full React example](https://github.com/jalal246/dflex/tree/master/packages/draggable/playgrounds/dflex-react-draggable)

- [Full Vue example](https://github.com/jalal246/dflex/tree/master/packages/draggable/playgrounds/dflex-vue-draggable)

## Project Content

DFlex Draggable is part of project contains:

- [DOM Generator](https://github.com/jalal246/dflex/tree/master/packages/dom-gen) DOM
  relations generator algorithm. Generate relations between DOM elements based
  on element depth without a browser.

- [DOM Store](https://github.com/jalal246/dflex/tree/master/packages/store) The
  only Store that allows you to traverse through the DOM tree using element id
  without reading from the browser.

- [Drag & Drop](https://github.com/jalal246/dflex/tree/master/packages/dnd) A
  Simple, lightweight Solution for a Drag & Drop App based on enhanced DOM store
  algorithm. You can achieve a drag and drop with three steps only with mouse
  event.

## Test

```sh
yarn test draggable
```

## License

DFlex is open source and dual-licensed as
[AGPL](https://github.com/jalal246/dflex/tree/master/packages/draggable/LICENSE)/Commercial
software.

DFlex is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

Buying a license is mandatory if you develop commercial activities using
DFlex inside your product or deploying it on a network without disclosing the
source code of your own applications under the AGPL license.

## Contribution

If you like this project, you can support it by contributing. If you find a bug,
please let me know, applying a pull request is welcome. This project needs your
support. You can fix typos, add new examples, or build with me new features.

> Support this project by giving it a Star ⭐
