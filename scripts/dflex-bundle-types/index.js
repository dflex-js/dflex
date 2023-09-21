// @ts-check

/* eslint-disable no-console */

import { rollup as _rollup } from "rollup";
import { resolve, join } from "path";
import packages from "npm-packages";
import { dts } from "rollup-plugin-dts";

/**
 * @param {"es" |"cjs"} format
 * @param {string} inputFile
 * @param {string} outputFile
 */
async function build(format, inputFile, outputFile) {
  const inputOptions = {
    input: inputFile,
    plugins: [dts({ tsconfig: resolve("./tsconfig.json") })],
  };

  const result = await _rollup(inputOptions);

  await result.write({
    externalLiveBindings: false,
    format,
    exports: "auto",
    file: outputFile,
    freeze: false,
    interop: undefined,
  });
}

const buildPromise = packages.map((pkg) => {
  const { sourcePath, typesPath, modules } = pkg;

  const { sourceFileName, format } = modules[1];

  const inputFile = resolve(join(sourcePath, sourceFileName));

  const outputFile = resolve(join(typesPath, "index.d.ts"));

  return build(format, inputFile, outputFile);
});

Promise.all(buildPromise)
  .then()
  .catch((e) => {
    console.error(e);
  });
