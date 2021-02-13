module.exports = {
  extends: ["airbnb-base", "prettier"],
  env: {
    browser: true,
    es2021: true,
  },
  rules: {},
  globals: {},
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["*.test.js"],
      env: {
        jest: true,
      },
    },
  ],
};
