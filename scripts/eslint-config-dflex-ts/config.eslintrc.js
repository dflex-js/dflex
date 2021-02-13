module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["eslint-config-dflex", "plugin:import/typescript"],
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
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
};
