import React from "react";

import Header from "../LayoutHeader";
import Footer from "../LayoutFooter";

// import Main from "../MainLayout";

import Flex from "../Flex";

import "./layout.css";
import { media } from "../../theme";

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
      <Flex
        direction="column"
        justifyContent="stretch"
        css={{
          flex: "1 0 auto",

          marginTop: 60,

          [media.between("medium", "large")]: {
            marginTop: 50,
          },

          [media.lessThan("medium")]: {
            marginTop: 40,
          },
        }}
      >
        {children}
      </Flex>
      <Footer />
    </div>
  );
};

export default Layout;
