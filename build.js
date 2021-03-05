require("esbuild")
  .build({
    entryPoints: ["packages/dom-gen/src/index.ts"],
    bundle: true,
    format: "esm",
    outfile: "packages/dom-gen/dist/dflexDomGen.js",
  })
  .catch(() => process.exit(1));
