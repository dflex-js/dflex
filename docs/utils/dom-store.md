---
id: introduction
title: DOM Store
sidebar_label: Introduction To DOM Store
description: "DOM elements store allows to traverse through the DOM tree using
element-id without using browser API."
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

## API

### Register Elements in the Store

<!-- created with: https://excalidraw.com/ -->

<p align="center">
 <img
 src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/store/img/store-registry.png"
 alt="how register works"/>
</p>

Registry works on creating
[pointer](../dom-gen/introduction#generate-element-pointer) for the element then
store it with the default input data.

```ts
register<T = ElmWIthPointer>(
  element: ElmInstance,
  CustomInstance?: Class<T>
)
```

Where `ElmInstance` should include:

- `id: string` - Element id.
- `depth: number` - Element depth in DOM tree. Starts from zero for the children.
- `ref: HTMLElement` - HTML element reference.

And `CustomInstance` is a class/constructor function. In case there's an operation
depends on generated pointer result before storing the element.

#### Registry Example

Let's create new store and register some elements in it:

```js
import Store from "dflex/store";

const store = new Store();

const refElm0 = document.createElement("div");

const elm0 = {
  id: "id-0",
  depth: 0,
  ref: refElm0,
};

store.register(elm0);
```

To store instance of `MyCustomClass` inside the store, just pass the class to the `register`

```js
class MyCustomClass {
  constructor({id, depth, ref, order, keys}){
    this.id = id;
    this.depth = depth;
    this.ref = ref;
    this.order = order;
    this.keys = keys;
    // Maybe another useful things depend on generated pointer.
  }
}


const elm1 = {
  id: "p-id-0",
  depth: 1,
  ref: <div id="p-id-0">
};

store.register(elm1, MyCustomClass);
```

> Calling register multiple times will cause updating DOM reference.

The register is typically called once to register the element reference inside
the store but calls it multiple times is expected as the layout usually changes
in your app. That's why calls it multiple times will cause updating DOM
reference and preserves others instance.

### Get Stored Element By ID

```ts
getElmById(id: string) : Object<ElmWIthPointer>
```

It returns `Object<ElmWIthPointer>` which contains element metadata including
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

- `rest: ClassInstance` - Class custom instance, if there's any passed when element is registered.

#### getElmById Example

Let's apply it on element with `id= id-0` which we already registered in the
store:

```js
const elemInstance = store.getElmById("id-0");

// elemInstance = {
//   depth: 0,
//   id: "id-0",
//   ref: <div id="id-0">
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

### Get Element branch

Gets all element IDs Siblings in given node represented by sibling key.

```ts
getElmBranchByKey(siblingsKy: string)
```

### Delete Element

Delete element from the registry. Should be called only when element is unmounted and expected to return with different positions only.

```ts
deleteElm(id: string)
```
