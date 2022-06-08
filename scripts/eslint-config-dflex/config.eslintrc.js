const OFF = 0;
const ERROR = 2;

module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    __DEV__: "readonly",
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["node_modules", "dist", "lib", "coverage", "**/*.d.ts"],
  rules: {
    "no-underscore-dangle": [ERROR, { allowAfterThis: true }],
    "no-nested-ternary": OFF,
    "no-use-before-define": OFF,
    "@typescript-eslint/no-use-before-define": [ERROR],
    "prettier/prettier": [
      ERROR,
      {
        endOfLine: "auto",
      },
    ],
    "import/extensions": [
      ERROR,
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
      files: ["*.test.js", "*.test.ts", "*.test.tsx"],
      env: {
        jest: true,
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
