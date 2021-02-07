const jsdocRules = {
  "jsdoc/check-access": 1,
  "jsdoc/check-alignment": 1,
  "jsdoc/check-examples": 1,
  "jsdoc/check-indentation": 1,
  "jsdoc/check-line-alignment": 1,
  "jsdoc/check-param-names": 1,
  "jsdoc/check-property-names": 1,
  "jsdoc/check-syntax": 1,
  "jsdoc/check-tag-names": 0, // template is invalid?
  "jsdoc/check-types": 0, // TS will do that for you.
  "jsdoc/check-values": 1, // Recommended
  "jsdoc/empty-tags": 1, // Recommended
  "jsdoc/implements-on-classes": 1, // Recommended
  "jsdoc/match-description": 1,
  "jsdoc/newline-after-description": 1, // Recommended
  "jsdoc/no-bad-blocks": 1,
  "jsdoc/no-defaults": 1,
  "jsdoc/no-types": 1,
  "jsdoc/no-undefined-types": 1, // Recommended
  "jsdoc/require-description": 0,
  "jsdoc/require-description-complete-sentence": 0, // doesn't work with template
  "jsdoc/require-example": 0,
  "jsdoc/require-file-overview": 0, // No.
  "jsdoc/require-hyphen-before-param-description": 1,
  "jsdoc/require-jsdoc": 1, // Recommended
  "jsdoc/require-param": 1, // Recommended
  "jsdoc/require-param-description": 0, // mostly unnecessary.
  "jsdoc/require-param-name": 1, // Recommended
  "jsdoc/require-param-type": 1, // Recommended
  "jsdoc/require-property": 1, // Recommended
  "jsdoc/require-property-description": 0, //  mostly unnecessary.
  "jsdoc/require-property-name": 1, // Recommended
  "jsdoc/require-property-type": 1, // Recommended
  "jsdoc/require-returns": 1, // Recommended
  "jsdoc/require-returns-check": 1, // Recommended
  "jsdoc/require-returns-description": 1, // Recommended
  "jsdoc/require-returns-type": 1, // Recommended
  "jsdoc/require-yields": 1, // Recommended
  "jsdoc/valid-types": 0, // Don't work with import types.
};

module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
  },
  extends: ["airbnb-base", "prettier", "jsdoc"],
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
  rules: jsdocRules,
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
