module.exports = {
  extends: ["plugin:cypress/recommended"],
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["./support/*.js", "./plugins/*.js"] },
    ],
  },
};
