module.exports = {
  extends: ["eslint-config-dflex"],
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        packageDir: __dirname,
      },
    ],
  },
};
