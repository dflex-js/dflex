module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier", "plugin:import/typescript"],
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
  globals: {},
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "tsdoc/syntax": "warn",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        js: "never",
      },
    ],
  },
  settings: {},
};
