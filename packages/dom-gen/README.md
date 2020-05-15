# @dflex/dom-gen

> Generates relations between dom elements depending on its depth.

```bash
npm install @dflex/dom-gen
```

It figures out relations between DOM element without storing them or creating
actual dom tree. Instead, it figures relationship based on element depth.

In case you are studying any dom-tree, you can build entire branches and
navigate through them using generated unique keys.

```ts
const domGen = new Generator();

domGen.getElmPointer(id: string, depth: number);
```

Returns pointer object refers to element relation with unique keys and its
index:

- `order: Object <elementOrder>`
  - `self: number` - element self index among its siblings.
  - `parent: number` - Parent index.
- `keys: Object <relationMap>`
  - `sK: string` - Siblings Key, where all siblings share this key.
  - `pK: string` - Parent key, all children share this key.
  - `chK: string` - Children Key valid for all elements above zero depth.

## Test

```sh
npm test
```

## License

This project is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/dom-gen/LICENSE)
