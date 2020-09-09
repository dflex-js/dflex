---
title: DFlex DnD
permalink: docs/dnd/index.html
prev: /
next: /
---

DFlex DnD is a simple, lightweight Solution for a Drag & Drop App.

### Installation

```bash
npm install @dflex/dnd
```

### Usage

DFlex DnD is written in pure JavaScript and can be used with different frameworks
whether it is React, Vue, Angular, etc.

It depends on animation, tracks each droppable area which makes the whole
process runs smoothly as much as possible.

<p align="center">
    <img src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dnd/public/dnd.gif" alt="show how drag and drop works" />
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dnd/public/dnd.png" alt="show drag and drop performance" />
</p>

### Three Steps

You can achieve a drag and drop with three steps only (register, start, end)

```js
import { store, DnD } from "@dflex/dnd";
```

### Register element

Each element should be registered in DnD store in order to be active later

```ts
store.register({ id: string, element: Node });
```

### Trigger dragging

Use `onmousedown` to trigger responsive dragging

```ts
const { target, clientX, clientY } = event;

dnd = new DnD(id: target.id, { x: clientX, y: clientY });
```

### End dragging

Use `onmouseup` to end dragging

```ts
const { clientX, clientY } = event;

dnd.dragAt(clientX, clientY);
```

You can see full React example in
[playgrounds](https://github.com/jalal246/dflex/tree/master/playgrounds/dflex-react-dnd).
Contributors feel free to apply PR for another frameworks and more examples. For
Draggable only you can use [DFlex Draggable](https://github.com/jalal246/dflex/tree/master/packages/draggable).

## Test

```sh
yarn test dnd
```

## License

This package is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/dnd/LICENSE)
