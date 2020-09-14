---
title: DOM Relations Store
permalink: docs/store/index.html
prev: /
next: /
---

The place where you traverse through the DOM tree using element-id

## Installation

```bash
npm install @dflex/store
```

## How it works

DFlex store works on connecting all registered elements and organizes the
relations between them using the DOM relations generator algorithm. Allowing
each element to be reached recursively using its id.

Why? To increase application performance if it relies heavily on the DOM nodes. To
be clear, this is not a case against HTML DOM API. Instead, this a way to
enhance dealing with nodes more freely when you rely on existing store instead
of letting the browser reads the nodes first, then you store them to do whatever
you want to do.

Giving this fact, the Dflex store is built on what you already have and you can
easily access: `id`, which is why ids are used as keys.

## Registering elements in the store

```ts
store.register(elmInstance: Object<elmInstance>)
```

Where `elmInstance` should include:

- `id: string` - element id.
- `depth: number` - element depth in DOM tree.
- `rest: any` - another data you want to store it for each element.

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

const elm0D1 = {
  id: "p-id-0",
  depth: 1,
  moreInfo: "I am the parent",
};
store.register(elm0D1);
```

## Getting element in the store

### Element Instance by ID

```ts
store.getElmById(id: string) :  Object<elmInstanceMeta>
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

### Element Tree by ID

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

Going back to our first element with `id= id-0`, we can get element instance, its parent instance,
and its connection branches as following:

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

Why this is matter? Because now you can traverse through DOM tree with existing
store. Note that `elmInstanceConnection.branches.parents` allows you to go up
while `elmInstanceConnection.branches.siblings` allows you to traverse through all
node siblings. And not only that, both ways retrieve nodes in order.

## Test

```sh
yarn test store
```

## License

This package is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/store/LICENSE)
