module.exports = {
  projects: ["<rootDir>", "<rootDir>/packages/dnd"],

  testEnvironment: "jsdom",
  preset: "jest-puppeteer",

  testPathIgnorePatterns: ["site"],
};
