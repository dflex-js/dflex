/* eslint-disable import/no-extraneous-dependencies */
// playwright.config.ts
import { PlaywrightTestConfig, devices } from "@playwright/test";

const { CI } = process.env;
const IS_CI = CI === "true";

const testDir = "./packages/dflex-dnd-playground/tests/";

const config: PlaywrightTestConfig = {
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  use: {
    trace: "on-first-retry",
    navigationTimeout: 30000,
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
