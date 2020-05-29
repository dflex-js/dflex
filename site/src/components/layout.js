import React from "react";

import Header from "./LayoutHeader";
import Main from "./MainLayout";

import "./layout.css";

const Layout = ({ children }) => {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 40px)",
      }}
    >
      <Header />
      <Main>{children}</Main>
    </div>
  );
};

export default Layout;
