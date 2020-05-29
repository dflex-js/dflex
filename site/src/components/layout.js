/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";

import Header from "./LayoutHeader/Header";

import Main from "./Main";

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

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
