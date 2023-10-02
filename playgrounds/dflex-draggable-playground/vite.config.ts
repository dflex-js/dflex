/* eslint-disable import/no-extraneous-dependencies */
import { UserConfigExport, defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { replaceCodePlugin } from "vite-plugin-replace";

const PORT = 3000;

const moduleResolution = [
  {
    find: "@dflex/utils",
    replacement: path.resolve("../../packages/dflex-utils/src/index.ts"),
  },
  {
    find: "@dflex/core-instance",
    replacement: path.resolve(
      "../../packages/dflex-core-instance/src/index.ts",
    ),
  },
  {
    find: "@dflex/store",
    replacement: path.resolve("../../packages/dflex-store/src/index.ts"),
  },
  {
    find: "@dflex/dom-gen",
    replacement: path.resolve("../../packages/dflex-dom-gen/src/index.ts"),
  },
  {
    find: "@dflex/draggable",
    replacement: path.resolve("../../packages/dflex-draggable/src/index.ts"),
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
