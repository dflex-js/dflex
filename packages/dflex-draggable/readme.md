<h1 align="center">
  <a href="https://www.dflex.dev/" target="_blank">
    <img
    src="https://raw.githubusercontent.com/dflex-js/dflex/master/DFlex-readme.png"
    alt="DFlex is a Javascript library for modern Drag and Drop apps" />
  </a>
</h1>

<h1 align="center">DFlex Draggable</h1>

<p align="center">
  <a href="https://github.com/dflex-js/dflex">
    <img
    src="https://img.shields.io/github/workflow/status/dflex-js/dflex/Unit Test"
    alt="Dflex build status" />
  </a>
  <a href="https://github.com/dflex-js/dflex/pulls">
    <img
    src="https://img.shields.io/github/issues-pr/dflex-js/dflex"
    alt="number of opened pull requests"/>
  </a>
  <a href="https://www.npmjs.com/package/@dflex/dnd">
    <img
    src="https://img.shields.io/npm/v/@dflex/dnd"
    alt="DFlex last released version" />
  </a>
  <a href="https://github.com/dflex-js/dflex/issues">
  <img
    src="https://img.shields.io/github/issues/dflex-js/dflex"
    alt="number of opened issues"/>
  </a>
  <a href="https://github.com/dflex-js/dflex/pulls">
   <img
   src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"
   alt="Dflex welcomes pull request" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=dflex_js">
    <img
    src="https://img.shields.io/twitter/url?label=Follow%20%40dflex_js&style=social&url=https%3A%2F%2Ftwitter.com%2Fdflex_js"
    alt="Follow DFlex on twitter" />
  </a>
</p>

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

## Documentation 📖

For documentation, more information about DFlex and a live demo, be sure to visit the DFlex website <https://www.dflex.dev/>

## License 🤝

DFlex is [MIT License](LICENSE).
