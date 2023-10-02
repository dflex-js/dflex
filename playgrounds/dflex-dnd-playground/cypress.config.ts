import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    testIsolation: false,
    video: false,
  },
});
