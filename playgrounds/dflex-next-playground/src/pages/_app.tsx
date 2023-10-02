import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "@dflex/dnd";

export default function App({ Component, pageProps }: AppProps) {
  // Not required but for testing.
  React.useEffect(() => {
    return () => {
      store.destroy();
    };
  }, []);

  return <Component {...pageProps} />;
}
