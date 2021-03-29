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

# @dflex/store

> Traverse through the DOM tree using element-id.

DFlex store works on connecting all registered elements and organizes the
relations between them using the DOM relations generator algorithm. Allowing
each element to be reached recursively using its id.

## Documentation

Visit DFlex site for more <https://jalal246.github.io/dflex/> and to see live
examples with the full code.

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

Registry works on creating [pointer](../dom-gen/introduction#generate-element-pointer) for element then store it with another passed data.

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

## Project Content

DFlex Store is part of project contains:

- [DOM Generator](https://github.com/jalal246/dflex/tree/master/packages/dom-gen) DOM
  relations generator algorithm. Generate relations between DOM elements based
  on element depth without a browser.

- [Drag & Drop](https://github.com/jalal246/dflex/tree/master/packages/dnd) A
  Simple, lightweight Solution for a Drag & Drop App based on enhanced DOM store
  algorithm. You can achieve a drag and drop with three steps only with mouse
  event.

- [Draggable](https://github.com/jalal246/dflex/tree/master/packages/draggable) A High-performance draggable elements written in pure JS works for Web and Mobile.

## Test

```sh
yarn test store
```

## License

## License

DFlex is open source and dual-licensed as
[AGPL](https://github.com/jalal246/dflex/tree/master/packages/store/LICENSE)/Commercial
software.

DFlex is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

Buying a license is mandatory if you develop commercial activities using
DFlex inside your product or deploying it on a network without disclosing the
source code of your own applications under the AGPL license.

## Contribution

If you like this project, you can support it by contributing. If you find a bug,
please let me know, applying a pull request is welcome. This project needs your
support. You can fix typos, add new examples, or build with me new features.

> Support this project by giving it a Star ⭐
