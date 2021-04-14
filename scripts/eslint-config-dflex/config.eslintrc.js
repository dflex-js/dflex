/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const OFF = 0;
const ERROR = 2;

module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc", "header"],
  ignorePatterns: ["node_modules", "dist", "lib", "coverage", "**/*.d.ts"],
  rules: {
    "no-nested-ternary": OFF,
    "header/header": [
      ERROR,
      "block",
      [
        "*",
        " * Copyright (c) Jalal Maskoun.",
        " *",
        " * This source code is licensed under the AGPL3.0 license found in the",
        " * LICENSE file in the root directory of this source tree.",
        " ",
      ],
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        ts: "never",
        tsx: "never",
        jsx: "never",
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {},
      node: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["*.test.js", "*.test.ts"],
      env: {
        jest: true,
      },
    },
    {
      files: ["*.ts"],
      rules: {
        "tsdoc/syntax": "error",
      },
    },
    {
      files: ["types.ts"],
      rules: {
        "no-unused-vars": OFF,
      },
    },
  ],
};
