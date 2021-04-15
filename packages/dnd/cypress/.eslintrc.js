/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = {
  extends: ["plugin:cypress/recommended"],
  rules: {
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
  },
};
