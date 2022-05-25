const isProd = process.env.NODE_ENV === "production";

const prefix = "Internal DFlex error.";

function invariant(message = prefix, condition = false) {
  if (condition) return;

  if (isProd) {
    throw new Error(prefix);
  }

  throw new Error(message);
}

export default invariant;
