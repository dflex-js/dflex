module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>packages"],
  moduleNameMapper: {
    "@dflex/(.+)$": "<rootDir>packages/$1/src",
  },
  moduleFileExtensions: ["ts", "js"],
  testPathIgnorePatterns: ["cypress", "site", "test/integration"],
};
