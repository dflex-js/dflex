module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier", "plugin:import/typescript"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-use-before-define": "error",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        js: "never",
        jsx: "never",
      },
    ],
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
