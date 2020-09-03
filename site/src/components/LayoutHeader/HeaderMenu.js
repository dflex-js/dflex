import React from "react";

import MenuLink from "./HeaderMenuLink";
import { media } from "../../theme";
import menuLinks from "./content";

const Nav = ({ location }) => (
  <nav
    css={{
      flex: "1",
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch",
      overflowX: "auto",
      overflowY: "hidden",
      WebkitOverflowScrolling: "touch",
      height: "100%",
      opacity: "95%",

      // Hide horizontal scrollbar
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      "::-webkit-scrollbar": {
        display: "none",
      },

      [media.size("xsmall")]: {
        flexGrow: "1",
        width: "auto",
      },
      [media.greaterThan("xlarge")]: {
        width: null,
      },
      [media.lessThan("small")]: {
        maskImage:
          "linear-gradient(to right, transparent, black 20px, black 90%, transparent)",
      },
    }}
  >
    {menuLinks.map(({ name, to }) => (
      <MenuLink
        key={name}
        name={name}
        to={to}
        isActive={location.pathname.includes(to.activeSelector)}
      />
    ))}
  </nav>
);

export default Nav;
