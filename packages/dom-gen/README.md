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

# @dflex/dom-gen

> DOM relations generator algorithm.

Dom generator generates relations between DOM elements based on element depth
without a browser.
It generates three keys: Siblings, Parent and Children keys and two
indexes one refers to node order in its level and the other refers to the parent
index in parental level.

Together: keys and indexes combined form of uniqueness for each element.

## Documentation

Visit DFlex site for more <https://jalal246.github.io/dflex/> and to see live
examples with the full code.

## Installation

```bash
npm install @dflex/dom-gen
```

In case you are dealing with any DOM-tree, you can build entire branches and traverse
through them using these generated unique keys and indexes. Think of relational
database or hash tables but applied in DOM tree.

## API

### Generate Element Pointer

<!-- created with: https://excalidraw.com/ -->

<p align="center">
 <img
  src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dom-gen/img/pointer.png"
  alt="how pointer works"/>
</p>

Element pointer refers to the element position and its relationship in DOM tree.
It's represented with `getElmPointer` as following:

```ts
const domGen = new Generator()

domGen.getElmPointer(id: string, depth: number)
```

Where `depth` represents element depth in the layout. The deeper the lower. The base node will be `depth=0`.

`getElmPointer` returns pointer object refers to element relation with its keys and related
index:

- `order: Object <elementOrder>`

  - `self: number` - Element self index among its siblings.
  - `parent: number` - Parent index among its siblings.

- `keys: Object <relationKey>`

  - `sK: string` - Siblings Key, connects nodes in the same level.
  - `pK: string` - Parent key, connects nodes in the higher level.
  - `chK: string` - Children Key, connects nodes in the lower level.

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

#### Auto connect

<!-- created with: https://excalidraw.com/ -->

<p align="center">
 <img
  src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dom-gen/img/connect.png"
  alt="how algorithm connect nodes"/>
</p>

ids form 0 to 2, all have same parent and siblings key. And it guarantees that
any any incoming parent will carry key `1-0` and exists in the same position `0`.

This goes also for any parent. Eventually, by using keys and indexes you can go up↑
and down↓.

Following the same logic we can go deeper:

```js
const pointer = domGen.getElmPointer("id-parent-1", 1);

// pointer = {
//   keys: {
//     chK: "0-0",
//     pK: "2-0",
//     sK: "1-0", // this key was generated previously in children level.
//   },
//   order: {
//     parent: 0, // all children aware of their parent index.
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

Take into consideration some major points:

- It works both ascending and descending. So, it doesn't care how nodes are
  mounted and it works with async mounting.

- It automatically attaches the tree and links each node to the suitable parent
  and siblings.

### Getting Branches

Despite the fact that `Generator` is not DOM store, it maintains some kind of
data to keep generate unique pointers. Every incoming node element belong to
branch contains all input ids distrusted by depth/level entries.

```ts
domGen.getElmBranch(sk: string) : string<id> | Array<ids>
```

where `sk` represents siblings key generated by `getElmPointer`. Going back to
our generated tree:

```js
const branchChildren = domGen.getElmBranch("0-0");

// branchChildren = ["id-0", "id-1", "id-2"];
```

Since we have only one parent `branchParents` contain one node only:

```js
const branchParents = domGen.getElmBranch("1-0");

// branchParents = "id-parent-1";
```

> Branches in DOM-Gen represented by siblings key (sk)

So, to get all branches:

```js
const { branches } = domGen;

// branches = {
//   "0-0": ["id-0", "id-1", "id-2"],
//   "1-0": "id-parent-1",
// };
```

### Updating Branches

There's no point in having DOM treemap without the ability to update it
according to some logic you've already implemented in your app. Following common
sense, you can do it easily with `setElmBranch`.

```ts
domGen.setElmBranch(sk: string, branch: string<id>|Array<ids>)
```

Let's continue working on our branches by switching the order of children.
Currently, we have: `"0-0": ["id-0", "id-1", "id-2"]` but element with `id-1`
has been switched with `id-2`.

```js
const { branches } = domGen;

const newBranch = ["id-0", "id-2", "id-1"];

domGen.setElmBranch("0-0", newBranch);

// branches = {
//   "0-0": ["id-0", "id-2", "id-1"],
//   "1-0": "id-parent-1",
// };
```

## Project Content

DFlex DOM Generator is part of project contains:

- [DOM Store](https://github.com/jalal246/dflex/tree/master/packages/store):The
  only Store that allows you to traverse through the DOM tree using element id
  without reading from the browser.

- [Drag & Drop](https://github.com/jalal246/dflex/tree/master/packages/dnd): A
  Simple, lightweight Solution for a Drag & Drop App based on enhanced DOM store
  algorithm. You can achieve a drag and drop with three steps only with mouse
  event.

- [Draggable](https://github.com/jalal246/dflex/tree/master/packages/draggable):
  A High-performance draggable elements written in pure JS works for Web and Mobile.

## Test

```sh
yarn test dom-gen
```

## License

This package is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/dom-gen/LICENSE)

## Contribution

If you like this project, you can support it by contributing. If you find a bug,
please let me know, applying a pull request is welcome. This project needs your
support. You can fix typos, add new examples, or build with me new features.

> Support this project by giving it a Star ⭐
