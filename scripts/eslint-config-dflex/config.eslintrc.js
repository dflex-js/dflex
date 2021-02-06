module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
  },
  extends: ["airbnb-base", "prettier", "plugin:jsdoc/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: {
    "jsdoc/require-property-description": 0,
    "jsdoc/require-returns-description": 0,
  },
  settings: {
    jsdoc: {
      preferredTypes: {
        object: "Object",
      },
    },
  },
  plugins: ["jsdoc"],
  overrides: [
    {
      files: ["*.test.js"],
      env: {
        jest: true,
      },
    },
  ],
};
