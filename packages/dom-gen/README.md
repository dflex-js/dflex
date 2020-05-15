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

## Test

```sh
npm test
```

## License

This project is licensed under the [GPL-3.0 License](https://github.com/jalal246/dflex/tree/master/packages/dom-gen/LICENSE)
