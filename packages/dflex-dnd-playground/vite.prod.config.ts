/* eslint-disable import/no-extraneous-dependencies */
import { UserConfigExport, defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { replaceCodePlugin } from "vite-plugin-replace";

const PORT = 3001;

const moduleResolution = [
  {
    find: "@dflex/dnd",
    replacement: path.resolve("../dflex-dnd/dist/dflex-dnd.mjs"),
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
  build: {
    minify: "terser",
    terserOptions: {
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
      compress: {
        toplevel: true,
      },
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(config);
