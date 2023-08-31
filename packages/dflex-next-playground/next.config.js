/** @type {import('next').NextConfig} */
// const path = require("path");
// eslint-disable-next-line import/no-unresolved
const webpack = require("webpack");

// const moduleResolution = [
//   {
//     find: "@dflex/dnd",
//     replacement: path.resolve("../dflex-dnd/src/index.ts"),
//   },
//   {
//     find: "@dflex/utils",
//     replacement: path.resolve("../dflex-utils/src/index.ts"),
//   },
//   {
//     find: "@dflex/core-instance",
//     replacement: path.resolve("../dflex-core-instance/src/index.ts"),
//   },
//   {
//     find: "@dflex/draggable",
//     replacement: path.resolve("../dflex-draggable/src/index.ts"),
//   },
//   {
//     find: "@dflex/store",
//     replacement: path.resolve("../dflex-store/src/index.ts"),
//   },
//   {
//     find: "@dflex/dom-gen",
//     replacement: path.resolve("../dflex-dom-gen/src/index.ts"),
//   },
// ];

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@dflex/dnd"],
  devServer: {
    port: 3002,
  },
  webpack: (config) => {
    // if (!isServer) {
    // }

    // Define a custom global variable to replace _dev_
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
      })
    );

    return config;
  },
};

module.exports = nextConfig;
