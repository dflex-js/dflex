---
id: introduction
title: Introduction
---

> Traverse through the DOM tree using element-id.

DFlex store works on connecting all registered elements and organizes the
relations between them using the DOM relations generator algorithm. Allowing
each element to be reached recursively using its id.

## Installation

```bash
npm install @dflex/store
```

## Why

To increase application performance if it relies heavily on the DOM nodes. To be
clear, this is not a case against HTML DOM API. Instead, this a way to enhance
dealing with nodes more freely when you rely on existing DOM store.

Giving this fact, the Dflex store is built on what you already have and you can
easily access each DOM node with `id`. In DFlex store ids are used as keys.

## Features

- Read once from the browser and avoid unnecessary painting.

- This is the only solution that allows you to get a full DOM tree.

- Avoid the slowness of `getElementById`.

- Implement it everywhere because it is not related to any framework/library.

## Register elements in the store

<!-- created with: https://excalidraw.com/ -->

<p align="center">
 <img
 src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/store/img/store-registry.png" 
 alt="how register works"/>
</p>

Registry works on creating
[pointer](https://github.com/jalal246/dflex/tree/master/packages/dom-gen#generates-element-pointer)
for element then store it with another passed data.

```ts
store.register(
  elmInstance: Object<elmInstance>,
  CustomInstance:? <Function>,
  options:? Object
)
```

Where `elmInstance` should include:

- `id: string` - element id.
- `depth: number` - element depth in DOM tree.
- `rest: any` - another data you want to store it for each element.

And `CustomInstance` is constructor function. In case there's an operation
depends on generated pointer result before storing the element.

While `options` is plain objects holds extra data to be registered in the store if
there's any. Gives more flexibility to separate the essential data in
`elmInstance` from extra once that will passed in `options`.

Let's create new store and register some elements in it:

```js
import Store from "dflex/store";

const store = new Store();

const elm0D0 = {
  id: "id-0",
  depth: 0,
  moreInfo: "I am the first child",
};
store.register(elm0D0);

const elm1D0 = {
  id: "id-1",
  depth: 0,
  moreInfo: "I am the second child",
};
store.register(elm1D0);
```

To store instance of `ExtraInstanceFunc`, just pass it to the `register`

```js
function ExtraInstanceFunc({ id, depth, moreInfo, pointer }) {
  this.id = id;
  this.depth = depth;
  this.moreInfo = moreInfo;
  this.pointer = pointer;
}

const elm0D1 = {
  id: "p-id-0",
  depth: 1,
  moreInfo: "I am the parent",
};

store.register(elm0D1, ExtraInstanceFunc);
```

## Getting element in the store

### Element Instance Meta by ID

```ts
store.getElmById(id: string) : Object<elmInstanceMeta>
```

It returns `Object<elmInstanceMeta>` which contains element metadata including
generated keys and indexes with registered data.

- `id: string` - element id.

- `depth: number` - element depth in DOM tree.

- `order: Object <elementOrder>`

  - `self: number` - Element self index among its siblings.
  - `parent: number` - Parent index among its siblings.

- `keys: Object <relationKey>`

  - `sK: string` - Siblings Key, connects nodes in the same level.
  - `pK: string` - Parent key, connects nodes in the higher level.
  - `chK: string` - Children Key, connects nodes in the lower level.

- `rest: any` - data already entered when element is registered.

Let's apply it on element with `id= id-0` which we already registered in the
store:

```js
const elemInstance = store.getElmById("id-0");

// elemInstance = {
//   depth: 0,
//   id: "id-0",
//   keys: {
//     chK: null,
//     pK: "1-0",
//     sK: "0-0",
//   },
//   moreInfo: "I am the first child",
//   order: {
//     parent: 0,
//     self: 0,
//   },
// };
```

### Element in Tree by ID

```ts
store.getElmTreeById(id: string) : Object<elmInstanceConnection>
```

It returns `Object<elmInstanceConnection>` which contains element connections in DOM tree with
registered data. It includes:

- `element: Object<elmInstanceMeta>`- for targeted element.

- `parent: Object<elmInstanceMeta>`- for element's parent.

- `branches: Object<treeBranches>`:

  - `siblings: string<id>|Array<ids>` - all element's siblings.

  - `parents: string<id>|Array<ids>` - all element's parents.

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

## Why this is matter

Because now you can traverse through DOM tree with existing store. Note that
`elmInstanceConnection.branches.parents` allows you to go up while
`elmInstanceConnection.branches.siblings` allows you to traverse through all
node siblings. And not only that, both ways retrieve nodes in order.
