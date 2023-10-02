/** @type {import('next').NextConfig} */
// eslint-disable-next-line import/no-unresolved
const webpack = require("webpack");

module.exports =
  process.env.NODE_ENV === "production"
    ? {
        reactStrictMode: true,
        typescript: {
          tsconfigPath: "./tsconfig.build.json",
        },
      }
    : {
        reactStrictMode: true,
        typescript: {
          tsconfigPath: "./tsconfig.json",
        },
        transpilePackages: ["@dflex/dnd"],
        webpack: (config) => {
          config.plugins.push(
            new webpack.DefinePlugin({
              __DEV__: "true",
            }),
          );

          return config;
        },
      };
