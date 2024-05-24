const OFF = 0;

module.exports = {
  extends: ["plugin:react/recommended", "eslint-config-dflex"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react"],
  rules: {
    "import/no-extraneous-dependencies": OFF,
    "react/prop-types": OFF,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
