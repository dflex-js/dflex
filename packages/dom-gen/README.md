# @dflex/dom-gen

> Generates relations between dom elements depending on its depth.

```bash
npm install @dflex/dom-gen
```

It figures out relations between DOM element without storing them or creating
actual dom tree. Instead, it gets relationship based on element depth. In case
you are studying any dom-tree, you can build entire branches and navigate
through them using generated unique keys.

```ts
const domGen = new Generator()

domGen.getElmPointer(id: string, depth: number)
```

Returns pointer object refers to element relation with its unique keys and
related index:

- `order: Object <elementOrder>`

  - `self: number` - Element self index among its siblings.
  - `parent: number` - Parent index.

- `keys: Object <relationKey>`

  - `sK: string` - Siblings Key, where all siblings share the same key.
  - `pK: string` - Parent key, shared between all children.
  - `chK: string` - Children Key, valid for all elements above zero depth.

```js
import Generator from "@dflex/dom-gen";

const domGen = new Generator();

let pointer = domGen.getElmPointer("id-0", 0);

// pointer = {
//   keys: {
//     chK: null,
//     pK: "1-0",
//     sK: "0-0",
//   },
//   order: {
//     parent: 0,
//     self: 0,
//   },
// };
```

Internally Generator has build dom tree as following:

```bash
DOM-root
│
│───id-0 => order:{ parent: 0, self: 0 } - keys: { chK: null , pK: "1-0", sK: "0-0" }
```

Adding more element on the same level:

```js
const domGen = new Generator();

const pointer1 = domGen.getElmPointer("id-1", 0);

// pointer1 = {
//   keys: {
//     chK: null,
//     pK: "1-0",
//     sK: "0-0",
//   },
//   order: {
//     parent: 0,
//     self: 1,
//   },
// };

const pointer2 = domGen.getElmPointer("id-2", 0);

// pointer2 = {
//   keys: {
//     chK: null,
//     pK: "1-0",
//     sK: "0-0",
//   },
//   order: {
//     parent: 0,
//     self: 2,
//   },
// };
```

And dom tree is:

```bash
DOM-root
│
│───id-0 => (order:{parent: 0, self: 0 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})
│
│───id-1 => (order:{parent: 0, self: 1 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})
│
│───id-2 => (order:{parent: 0, self: 2 }) || (keys: {chK: null,pK: "1-0",sK: "0-0"})
```

Following the same logic we can go deeper:

```js
const domGen = new Generator();

const pointer = domGen.getElmPointer("id-parent-1", 1);

// pointer = {
//   keys: {
//     chK: "0-0",
//     pK: "2-0",
//     sK: "1-0",
//   },
//   order: {
//     parent: 0,
//     self: 0,
//   },
// };
```

And dom tree is with relational key is as following:

```bash
DOM-root
├───id-parent-1 (order:{parent: 0, self: 0 })   || (keys: {chK: "0-0",pK: "2-0",sK: "1-0"})
    |
    │───id-0  => (order:{parent: 0, self: 0 })  || (keys: {chK: null,pK: "1-0",sK: "0-0"})
    │
    │───id-1 => ..
    │
    │───id-2 => ..

```

## Test

```sh
npm test
```

## License

This project is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/dom-gen/LICENSE)
