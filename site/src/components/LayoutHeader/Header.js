import React from "react";
import { Link } from "gatsby";

import { colors, media } from "../../theme";

import Container from "../Container";
import ExternalLinkSvg from "../ExternalLinkSvg";
import Nav from "./HeaderMenu";

const GitHubNav = () => (
  <div
    css={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      width: "auto",
    }}
  >
    <a
      css={{
        padding: "5px 10px",
        marginLeft: 10,
        whiteSpace: "nowrap",
        opacity: "95%",
        color: "inherit",
        textDecoration: "none",
        ":hover": {
          color: colors.logo,
        },

        ":focus": {
          outline: 0,
          backgroundColor: colors.light,
          borderRadius: 15,
        },

        [media.lessThan("large")]: {
          display: "none",
        },
      }}
      href="https://github.com/jalal246/dflex/"
      rel="noopener"
    >
      GitHub
      <ExternalLinkSvg
        cssProps={{
          marginLeft: 5,
          verticalAlign: -2,
          color: colors.white,
        }}
      />
    </a>
  </div>
);

const Logo = () => (
  <Link
    css={{
      display: "flex",
      marginRight: 10,
      height: "100%",
      alignItems: "center",
      color: colors.logo,
      textDecoration: "none",
      ":focus": {
        outline: 0,
        color: colors.white,
      },

      [media.greaterThan("small")]: {
        width: "calc(100% / 6)",
      },
      [media.lessThan("small")]: {
        flex: "0 0 auto",
      },
    }}
    to="/"
  >
    <span
      css={{
        color: "inherit",
        marginLeft: 10,
        fontWeight: 700,
        fontSize: 40,
        lineHeight: "20px",
        [media.lessThan("large")]: {
          fontSize: 16,
          marginTop: 1,
        },
        [media.lessThan("small")]: {
          // Visually hidden
          position: "absolute",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          height: 1,
          width: 1,
          margin: -1,
          padding: 0,
          border: 0,
        },
      }}
    >
      DFlex
    </span>
  </Link>
);

const Header = ({ location }) => (
  <header
    css={{
      fontFamily: "georgia, serif",
      backgroundColor: colors.dark,
      color: colors.white,
      position: "fixed",
      zIndex: 1,
      width: "100%",
      top: 0,
      left: 0,
      "@media print": {
        display: "none",
      },
    }}
  >
    <Container>
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 60,
          [media.between("small", "large")]: {
            height: 50,
          },
          [media.lessThan("small")]: {
            height: 40,
          },
        }}
      >
        {location && location.pathname !== `/` && <Logo />}
        <Nav location={location} />
        <GitHubNav />
      </div>
    </Container>
  </header>
);

export default Header;
