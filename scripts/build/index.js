// @ts-check

/* eslint-disable no-console */

import { rollup as _rollup } from "rollup";
import { resolve, join } from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import { createFilter } from "@rollup/pluginutils";
import minimist from "minimist";
import packages from "npm-packages";

const argv = minimist(process.argv.slice(2));

/** @type boolean */
const $isProduction = argv.production;
/** @type boolean */
const $isRelease = argv.release;
/** @type boolean */
const $isMinify = argv.minify;

const externals = [];

const moduleResolution = packages.map((pkg) => ({
  find: pkg.pkgName,
  replacement: resolve(
    pkg.sourcePath,
    // @ts-expect-error
    pkg.modules.find((m) => m.format === "cjs").sourceFileName,
  ),
}));

// const reserved = [
//   // Directions.
//   "top",
//   "left",
//   "bottom",
//   "right",
//   "width",
//   "height",

//   // DFlex Cycle.
//   "marginTop",
//   "marginBottom",

//   // DnD
//   "dragAt",
//   "endDragging",
// ];

function deleteMethodsPlugin(options = {}) {
  const { suffix } = options;
  const filter = createFilter();

  return {
    name: "delete-methods",

    /**
     * Transform function to modify the code.
     * @param {string} code - The code of the file being transformed.
     * @returns {Object} Transformed code and source map.
     */
    transform(code) {
      if (!filter(this.id)) return null;

      return {
        code: code.replace(
          new RegExp(`\\b\\w+\\.${suffix}\\s*=\\s*function\\s*\\(`, "g"),
          "",
        ),
        map: null,
      };
    },
  };
}

/**
 * @param {boolean} isProd
 * @param {boolean} isMinify
 */
const plugins = (isProd, isMinify) => [
  isProd &&
    deleteMethodsPlugin({
      suffix: "_DEV_",
    }),
  alias({
    entries: moduleResolution,
  }),
  nodeResolve({
    extensions: [".js", ".ts"],
  }),
  babel({
    babelHelpers: "bundled",
    babelrc: false,
    configFile: false,
    exclude: "/**/node_modules/**",
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    presets: [
      [
        "@babel/preset-typescript",
        {
          tsconfig: resolve("./tsconfig.json"),
        },
      ],
    ],
  }),
  commonjs(),
  replace({
    __DEV__: isProd ? "false" : "true",
    delimiters: ["", ""],
    preventAssignment: true,
  }),
  isMinify &&
    terser({
      toplevel: true,
      module: true,
      ecma: 2019,
      compress: {
        passes: 2,
        pure_getters: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    }),
];

/**
 * @param {string} name
 * @param {"es" |"cjs"} format
 * @param {string} inputFile
 * @param {string} outputFile
 * @param {boolean} isProd
 * @param {boolean} isMinify
 */
async function build(name, format, inputFile, outputFile, isProd, isMinify) {
  const inputOptions = {
    /**
     * @param {any} modulesPath
     */
    external(modulesPath) {
      return externals.includes(modulesPath);
    },
    input: inputFile,
    onwarn(warning) {
      if (warning.code === "CIRCULAR_DEPENDENCY") {
        return;
      }
      console.error();
      console.error(warning.message || warning);
      console.error();
    },
    plugins: plugins(isProd, isMinify),
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
  const { sourcePath, outputPath, name, modules } = pkg;

  const modulesIntoBundlePipe = modules.map((m) => ({
    ...m,
    isMinify: $isMinify,
    isProduction: $isProduction,
  }));

  if ($isRelease) {
    modules.forEach((m) => {
      modulesIntoBundlePipe.push({
        ...m,
        isMinify: false,
        // Since this is development bundle.
        isProduction: false,
        // All modules will be named dev.extension
        outputFileName: `dev.${m.outputFileName.split(".")[1]}`,
      });
    });
  }

  return modulesIntoBundlePipe.map((module) => {
    const { sourceFileName, outputFileName, format, isProduction, isMinify } =
      module;

    const inputFile = resolve(join(sourcePath, sourceFileName));

    const outputFile = resolve(join(outputPath, outputFileName));

    return build(
      name,
      // @ts-ignore
      format,
      inputFile,
      outputFile,
      isProduction,
      isMinify,
    );
  });
});

Promise.all(buildPromise)
  .then()
  .catch((e) => {
    console.error(e);
  });
