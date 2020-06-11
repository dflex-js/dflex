# @dflex/draggable

> Draggable native component written in pure JS and works for Web and Mobile

```bash
npm install @dflex/draggable
```

DFlex draggable is the simplest solution to create JavaScript draggable
elements. No need for special tutorial and thinking about implementation
complexity or even migration to different technologies for different frameworks.

## API

```js
import { store, Draggable } from "@dflex/draggable";
```

Just register draggable elements, then trigger drag.

For Each draggable element:

```ts
store.register({ id: string, element: Node });
```

Initiates draggable element `onmousedown`:

```ts
const draggable = new Draggable(id: string, {x: event.clientX, y: event.clientY});
```

|                     |                                                         |               |
| ------------------- | ------------------------------------------------------- | ------------- |
| **Create Instance** | `new Draggable(id, {x:event.clientX, y:event.clientY})` | `onmousedown` |
| **Move element**    | `dragAt(event.clientX, event.clientY)`                  | `onmousemove` |
| **End Dragging**    | `endDragged()`                                          | `onmouseup`   |

## Test

TODO

## License

This package is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/draggable/LICENSE)
