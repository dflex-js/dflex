/* eslint-disable import/no-extraneous-dependencies */
import { UserConfigExport, defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { replaceCodePlugin } from "vite-plugin-replace";

const PORT = 3001;

const moduleResolution = [
  {
    find: "@dflex/dnd",
    replacement: path.resolve("../dflex-dnd/src/index.ts"),
  },
  {
    find: "@dflex/utils",
    replacement: path.resolve("../dflex-utils/src/index.ts"),
  },
  {
    find: "@dflex/core-instance",
    replacement: path.resolve("../dflex-core-instance/src/index.ts"),
  },
  {
    find: "@dflex/draggable",
    replacement: path.resolve("../dflex-draggable/src/index.ts"),
  },
  {
    find: "@dflex/store",
    replacement: path.resolve("../dflex-store/src/index.ts"),
  },
  {
    find: "@dflex/dom-gen",
    replacement: path.resolve("../dflex-dom-gen/src/index.ts"),
  },
];

const config: UserConfigExport = {
  plugins: [
    react(),
    replaceCodePlugin({
      replacements: [
        {
          from: /__DEV__/g,
          to: "true",
        },
      ],
    }),
  ],
  server: {
    port: PORT,
  },
  preview: {
    port: PORT,
  },
  resolve: {
    alias: moduleResolution,
  },
};

// https://vitejs.dev/config/
export default defineConfig(config);
