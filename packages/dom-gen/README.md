# @dflex/dom-gen

> DOM relations generator algorithm.

```bash
npm install @dflex/dom-gen
```

It generates relations between DOM elements without storing them or creating
actual dom tree. Instead, it gets relationship based on element depth.

For each DOM node, it generates three keys: Siblings, Parent and Children
keys and two indexes one refers to node order in its level and the other refers to
the parent index in parental level so to speak. Together: keys and indexes
combined form of uniqueness for each element.

In case you are dealing with any DOM-tree, you can build entire branches and navigate
through them using these generated unique keys and indexes. Think of relational
database or hash tables but applied in DOM tree.

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

Internally `Generator` has build dom tree as following:

```bash
DOM-root
│
│───id-0 => order: { parent: 0, self: 0 } || keys: { chK: null , pK: "1-0", sK: "0-0" }
```

Adding more elements on the same level:

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
│───id-0 => order: {parent: 0, self: 0} || keys: {chK: null, pK: "1-0", sK: "0-0"}
│
│───id-1 => order: {parent: 0, self: 1} || keys: {chK: null, pK: "1-0", sK: "0-0"}
│
│───id-2 => order: {parent: 0, self: 2} || keys: {chK: null, pK: "1-0", sK: "0-0"}
```

**Note:** ids form 0 to 2, all have same parent and siblings key. And it
guarantees that any any incoming parent will carry key `1-0` and exists in
position `0`. And this goes also for any parent. Eventually, using keys and
indexes you can go up↑ and down↓.

Following the same logic we can go deeper:

```js
const domGen = new Generator();

const pointer = domGen.getElmPointer("id-parent-1", 1);

// pointer = {
//   keys: {
//     chK: "0-0",
//     pK: "2-0",
//     sK: "1-0", // this key was generated previously in children level
//   },
//   order: {
//     parent: 0,
//     self: 0,
//   },
// };
```

Changing the depth identifies new level. Take a look at current dom tree that we
now have:

```bash
DOM-root
├───id-parent-1  => order: {parent: 0, self: 0} || keys: {chK: "0-0", pK: "2-0", sK: "1-0"}
    |
    │───id-0  => order: {parent: 0, self: 0} || keys: {chK: null, pK: "1-0", sK: "0-0"}
    │
    │───id-1 => ..
    │
    │───id-2 => ..

```

**Take into consideration some major points:**

- It works both ascending and descending. So, it doesn't care how nodes are
  mounted and it works with async mounting.

- It automatically attaches the tree and links each node to the suitable parent
  and siblings.

- It doesn't store keys and ids. All the id's and depth validations
  should be done outside `Generator` logic. Also, storing relationships should
  be done separately in a store.

## Test

```sh
npm test
```

## License

This package is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/dom-gen/LICENSE)
