module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  plugins: [
    "@typescript-eslint",
    "plugin:import/typescript",
    "eslint-plugin-tsdoc",
  ],
  globals: {},
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "tsdoc/syntax": "warn",
  },
  settings: {},
};
