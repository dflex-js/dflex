const packages = [
  {
    name: "DFlex Utilities",
    pkgName: "@dflex/utils",
    modules: [
      {
        format: "cjs",
        outputFileName: "dflex-utils.js",
        sourceFileName: "index.ts",
      },
      {
        format: "es",
        outputFileName: "dflex-utils.mjs",
        sourceFileName: "index.ts",
      },
    ],
    outputPath: "./packages/dflex-utils/dist",
    sourcePath: "./packages/dflex-utils/src",
    typesPath: "./packages/dflex-utils/types",
  },
  {
    name: "DFlex DOM Generator",
    pkgName: "@dflex/dom-gen",
    modules: [
      {
        format: "cjs",
        sourceFileName: "index.ts",
        outputFileName: "dflex-dom.js",
      },
      {
        format: "es",
        sourceFileName: "index.ts",
        outputFileName: "dflex-dom.mjs",
      },
    ],
    outputPath: "./packages/dflex-dom-gen/dist",
    sourcePath: "./packages/dflex-dom-gen/src",
    typesPath: "./packages/dflex-dom-gen/types",
  },
  {
    name: "DFlex Core Instance",
    pkgName: "@dflex/core-instance",
    modules: [
      {
        format: "cjs",
        sourceFileName: "index.ts",
        outputFileName: "dflex-core.js",
      },
      {
        format: "es",
        sourceFileName: "index.ts",
        outputFileName: "dflex-core.mjs",
      },
    ],
    outputPath: "./packages/dflex-core-instance/dist",
    sourcePath: "./packages/dflex-core-instance/src",
    typesPath: "./packages/dflex-core-instance/types",
  },
  {
    name: "DFlex Store",
    pkgName: "@dflex/store",
    modules: [
      {
        format: "cjs",
        sourceFileName: "index.ts",
        outputFileName: "dflex-store.js",
      },
      {
        format: "es",
        sourceFileName: "index.ts",
        outputFileName: "dflex-store.mjs",
      },
    ],
    outputPath: "./packages/dflex-store/dist",
    sourcePath: "./packages/dflex-store/src",
    typesPath: "./packages/dflex-store/types",
  },
  {
    name: "DFlex Draggable Only",
    pkgName: "@dflex/draggable",
    modules: [
      {
        format: "cjs",
        sourceFileName: "index.ts",
        outputFileName: "dflex-draggable.js",
      },
      {
        format: "es",
        sourceFileName: "index.ts",
        outputFileName: "dflex-draggable.mjs",
      },
    ],
    outputPath: "./packages/dflex-draggable/dist",
    sourcePath: "./packages/dflex-draggable/src",
    typesPath: "./packages/dflex-draggable/types",
  },
  {
    name: "DFlex Drag and Drop",
    pkgName: "@dflex/dnd",
    modules: [
      {
        format: "cjs",
        sourceFileName: "index.ts",
        outputFileName: "dflex-dnd.js",
      },
      {
        format: "es",
        sourceFileName: "index.ts",
        outputFileName: "dflex-dnd.mjs",
      },
    ],
    outputPath: "./packages/dflex-dnd/dist",
    sourcePath: "./packages/dflex-dnd/src",
    typesPath: "./packages/dflex-dnd/types",
  },
];

export default packages;
