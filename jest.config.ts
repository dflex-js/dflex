import type { InitialOptionsTsJest } from "ts-jest";

const tsJestConfig: InitialOptionsTsJest = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  globals: {
    __DEV__: true,
    // https://github.com/testing-library/react-testing-library/issues/1061#issuecomment-1117450890
    IS_REACT_ACT_ENVIRONMENT: true,
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  moduleNameMapper: {
    "^./dist/(.+)": "./src/$1",
    "^@dflex/utils$": "<rootDir>/packages/dflex-utils/src/index.ts",
    "^@dflex/dom-gen$": "<rootDir>/packages/dflex-dom-gen/src/index.ts",
    "^@dflex/core-instance$":
      "<rootDir>/packages/dflex-core-instance/src/index.ts",
    "^@dflex/store$": "<rootDir>/packages/dflex-store/src/index.ts",
    "^@dflex/draggable$": "<rootDir>/packages/dflex-draggable/src/index.ts",
    "^@dflex/dnd$": "<rootDir>/packages/dflex-dnd/src/index.ts",
  },
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["cypress"],
  preset: "ts-jest",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testMatch: ["**/test/**/*.test{.ts,.tsx,.js,.jsx}"],
};

export default tsJestConfig;
