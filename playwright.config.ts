/* eslint-disable import/no-extraneous-dependencies */

import { PlaywrightTestConfig, devices } from "@playwright/test";

const { CI } = process.env;
const IS_CI = CI === "true";

const testDir = "./packages/dflex-dnd-playground/tests/";
const baseURL = "http://localhost:3001";

const config: PlaywrightTestConfig = {
  forbidOnly: IS_CI,
  retries: IS_CI ? 4 : 0,
  use: {
    // trace: "on-first-retry",
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
