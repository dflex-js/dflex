# @dflex/draggable

> Draggable is a native utility written in pure JS works for Web and Mobile

```bash
npm install @dflex/draggable
```

<p align="center">
    <img
     src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/draggable/img/draggable.gif" 
     alt="show how draggable works" />
</p>

DFlex draggable is the simplest solution to create JavaScript draggable
elements. No need for a special tutorial and thinking about implementation
complexity or even migration to different technologies for different frameworks.
It can be used with any app you have whether it is React, Vue, Angular or Svelte.s

## API

```js
import { store, Draggable } from "@dflex/draggable";
```

### Registry

Register draggable element in draggable store:

```ts
store.register({ id: string, element: Node });
```

### Draggable instance

Create draggable instance `onmousedown`:

```ts
const draggable = new Draggable(id: string, {x: event.clientX, y: event.clientY});
```

Move element `onmousemove`

```ts
draggable.dragAt(event.clientX, event.clientY);
```

End Dragging `onmouseup`

```ts
draggable.endDragging();
```

#### Examples

- [Full React example](https://github.com/jalal246/dflex/tree/master/packages/draggable/playgrounds/dflex-react-draggable)

- [Full Vue example](https://github.com/jalal246/dflex/tree/master/packages/draggable/playgrounds/dflex-vue-draggable)

## Test

```sh
yarn test draggable
```

## License

This package is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/draggable/LICENSE)

## Contribution

If you like this project, you can support it by contributing. If you find a bug,
please let me know, applying a pull request is welcome. This project needs your
support. You can fix typos, add new examples, or build with me new features.

> Support this project by giving it a Star ⭐
