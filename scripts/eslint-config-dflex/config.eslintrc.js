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
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
  ignorePatterns: ["node_modules", "dist", "lib", "coverage", "**/*.d.ts"],
  rules: {
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
      files: ["*.types.ts"],
      rules: {
        "no-unused-vars": "ignore",
      },
    },
  ],
};
