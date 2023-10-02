export const TransformTimeout = {
  timeout: 30000,
};

const { PACKAGE_BUNDLE } = process.env;

export const isProdBundle = PACKAGE_BUNDLE === "production";

export const DEVELOPMENT_ONLY_ASSERTION =
  "This assertion works with development bundle only";
