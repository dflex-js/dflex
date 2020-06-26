module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
  },
  extends: ["airbnb-base", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: {},
  plugins: ["tree-shaking"],
  overrides: [
    {
      files: ["packages/**/test/*.test.js"],
      env: {
        jest: true,
      },
    },
  ],
};
