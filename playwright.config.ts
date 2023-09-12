/* eslint-disable import/no-extraneous-dependencies */

import { PlaywrightTestConfig, devices } from "@playwright/test";

const { CI, PLAYGROUND_TYPE = "dflex-dnd" } = process.env;
const IS_CI = CI === "true";

let testDir = "";
let baseURL = "";

if (PLAYGROUND_TYPE === "dflex-dnd") {
  testDir = "./packages/dflex-dnd-playground/tests/";
  baseURL = "http://localhost:3001";
} else {
  throw new Error(
    "Invalid PLAYGROUND_TYPE. Please set PLAYGROUND_TYPE to 'dflex-dnd' for dflex-dnd playground.",
  );
}

const config: PlaywrightTestConfig = {
  forbidOnly: IS_CI,
  retries: IS_CI ? 4 : 1,
  timeout: 30000,
  use: {
    video: "retain-on-failure",
    navigationTimeout: 30000,
    baseURL,
    viewport: {
      height: 1080,
      width: 1920,
    },
  },
  projects: [
    {
      name: "chromium",
      testDir,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testDir,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testDir,
      use: { ...devices["Desktop Safari"] },
    },
  ],
};

export default config;
