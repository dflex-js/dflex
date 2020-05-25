# @dflex/store

> The place where you get node connections by id.

```bash
npm install @dflex/store
```

DFlex store works on connecting all registered elements and organizes the
relations between them using the DOM relations generator algorithm. Allowing
each element to be reached, recursively using its id.

Why? To increase application performance if it relies heavily on the DOM nodes. To
be clear, this is not a case against HTML DOM API. Instead, this a way to
enhance dealing with nodes more freely when you rely on existing store instead
of letting the browser reads nodes first then store it to do whatever you want
to do.

Giving this fact, the Dflex store is built on what you already have and easy to
access: `id`.

## Start by register elements in the store

```ts
store.register(elmInstance: Object<elmInstance>)
```

Where `elmInstance` should include:

- `id: string` - element id.
- `depth: number` - element depth in DOM tree.
- `rest: any` - other data you want to store it for each element.

```js
const elm0D0 = {
  id: "id-0",
  depth: 0,
  moreInfo: "I am the first child",
};

const elm1D0 = {
  id: "id-1",
  depth: 0,
  moreInfo: "I am the second child",
};

const elm0D1 = {
  id: "p-id-0",
  depth: 1,
  moreInfo: "I am the parent",
};

store.register(elm0D0);
store.register(elm1D0);

store.register(elm0D1);
```

### Exploring what's inside

```js
const registeredBranches = store.branches;

registeredBranches = {
  "0-0": ["id-0", "id-1"],
  "1-0": "p-id-0",
};
```

## Getting element connection in the store

```ts
store.getElmById(id: string) :  Object<elmInstanceConnection>
```

`Object<elmInstanceConnection>` includes element instance and its relation:

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

## Test

```sh
npm test
```

## License

This package is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/store/LICENSE)
