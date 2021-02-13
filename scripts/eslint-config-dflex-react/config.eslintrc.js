module.exports = {
  extends: ["plugin:react/recommended", "eslint-config-dflex"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "linebreak-style": 0,
    "react/jsx-filename-extension": 0,
    "react/prop-types": 0,
    "comma-dangle": 0,
    "react/jsx-props-no-spreading": 0,
  },
};
