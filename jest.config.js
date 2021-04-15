/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>packages"],
  moduleNameMapper: {
    "@dflex/(.+)$": "<rootDir>packages/$1/src",
  },
  moduleFileExtensions: ["ts", "js"],
  testPathIgnorePatterns: ["cypress", "site", "test/integration"],
};
