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

# @dflex/dnd

> A Simple, lightweight Solution for a Drag & Drop App

DFlex DnD is written in pure JavaScript and can be used with different frameworks
whether it is React, Vue, Angular, etc.

It depends on animation, tracks each droppable area which makes the whole
process runs smoothly as much as possible.

## Documentation

Visit DFlex site for more <https://jalal246.github.io/dflex/> and to see live
examples with the full code.

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
store.register({ id: String, ref: HTMLElement, depth: Number });
```

- `id: String` is unique identifer for an element in the registry.
- `ref: HTMLElement` targeted DOM element.
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

### Get Element Tree By ID

```ts
store.getElmTreeById(id: string) : Object<ElmTree>
```

It returns `Object<ElmTree>` which contains element connections in DOM tree with
registered data. It includes:

- `element: Object<elmInstanceMeta>`- for targeted element.

- `parent: Object<elmInstanceMeta>`- for element's parent.

- `branches: Object<treeBranches>`:

  - `siblings: string<id>|Array<ids>` - all element's siblings.

  - `parents: string<id>|Array<ids>` - all element's parents.

#### getElmTreeById Example

Going back to our first element with `id= id-0`, we can get element instance,
its parent instance, and its connection branches as following:

```js
const elmInstanceConnection = store.getElmTreeById("id-0");

// elmInstanceConnection = {
//   element: {
//     id: "id-0",
//     depth: 0,
//     moreInfo: "I am the first child",
//     order: { self: 0, parent: 0 },
//     keys: { sK: "0-0", pK: "1-0", chK: null },
//   },
//   parent: {
//     depth: 1,
//     id: "p-id-0",
//     keys: {
//       chK: "0-0",
//       pK: "2-0",
//       sK: "1-0",
//     },
//     moreInfo: "I am the parent",
//     order: {
//       parent: 0,
//       self: 0,
//     },
//   },
//   branches: { siblings: ["id-0", "id-1"], parents: "p-id-0" },
// };
```

#### Why this is matter

Because now you can traverse through DOM tree with existing store. Note that
`elmInstanceConnection.branches.parents` allows you to go up while
`elmInstanceConnection.branches.siblings` allows you to traverse through all
node siblings. And not only that, both ways retrieve nodes in order.

#### Examples

- [Full React example](https://github.com/jalal246/dflex/tree/master/packages/dnd/playgrounds/dflex-react-dnd)

- [Full Vue example](https://github.com/jalal246/dflex/tree/master/packages/dnd/playgrounds/dflex-vue-dnd)

## Project Content

DFlex Drag and Drop is part of project contains:

- [DOM Generator](https://github.com/jalal246/dflex/tree/master/packages/dom-gen) DOM
  relations generator algorithm. Generate relations between DOM elements
  based on element depth without a browser.

- [DOM Store](https://github.com/jalal246/dflex/tree/master/packages/store) The
  only Store that allows you to traverse through the DOM tree using element id
  without reading from the browser.

- [Draggable](https://github.com/jalal246/dflex/tree/master/packages/draggable)
  A High-performance draggable elements written in pure JS works for Web and
  Mobile.

## Test

```sh
yarn test dnd
```

## License

This package is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/dnd/LICENSE)

## Contribution

If you like this project, you can support it by contributing. If you find a bug,
please let me know, applying a pull request is welcome. This project needs your
support. You can fix typos, add new examples, or build with me new features.

> Support this project by giving it a Star ⭐
