# @dflex/dnd

> Simple & Light Solution for a Progressive Drop and Drag App

```bash
npm install @dflex/dnd
```

<p align="center">
    <img src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dnd/public/dnd.gif" alt="show how drag and drop works" />
</p>

DFlex DnD is written in Pure JavaScript and can be used with different frameworks
wither it is React, Vue, Angular, etc.

It depends on animation, tracking each droppable area which makes the whole
process runs smoothly as much as possible.

<p align="center">
    <img src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dnd/public/dnd.png" alt="show drag and drop performance" />
</p>

## Three Steps

You can achieve drop and drag with three steps:

```js
import { store, DnD } from "@dflex/dnd";
```

### Register element

Each element should be registered in DnD store be active

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
Contributors feel free to apply PR for another frameworks.

## Test

```sh
yarn test dnd
```

## License

This package is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/dnd/LICENSE)
