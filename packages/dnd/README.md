# @dflex/dnd

> A Simple, lightweight Solution for a Drag & Drop App

```bash
npm install @dflex/dnd
```

<p align="center">
 <img 
  src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dnd/public/dnd.gif" 
  alt="show how drag and drop works" />
</p>

DFlex DnD is written in pure JavaScript and can be used with different frameworks
whether it is React, Vue, Angular, etc.

It depends on animation, tracks each droppable area which makes the whole
process runs smoothly as much as possible.

<p align="center">
 <img src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dnd/public/dnd.png"
 alt="show drag and drop performance" />
</p>

## Three Steps

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

#### Examples

- [Full React example](https://github.com/jalal246/dflex/tree/master/packages/dnd/playgrounds/dflex-react-dnd)

- [Full Vue example](https://github.com/jalal246/dflex/tree/master/packages/dnd/playgrounds/dflex-vue-dnd)

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
