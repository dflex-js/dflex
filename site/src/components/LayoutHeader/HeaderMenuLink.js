import React from "react";
import { Link } from "gatsby";

import { media, colors } from "../../theme";

const activeAfterStyle = {
  [media.greaterThan("small")]: {
    position: "absolute",
    bottom: -1,
    height: 4,
    background: colors.brand,
    left: 0,
    right: 0,
    zIndex: 1,
  },
};

const style = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  color: colors.white,
  transition: "color 0.2s ease-out",
  paddingLeft: 15,
  paddingRight: 15,
  fontWeight: 300,

  ":focus": {
    outline: 0,
    backgroundColor: colors.light,
    color: colors.white,
  },

  [media.size("xsmall")]: {
    paddingLeft: 8,
    paddingRight: 8,
  },

  [media.between("small", "medium")]: {
    paddingLeft: 10,
    paddingRight: 10,
  },

  [media.greaterThan("xlarge")]: {
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 18,

    ":hover:not(:focus)": {
      color: colors.logo,
    },
  },
};

const activeStyle = {
  color: colors.brand,

  [media.greaterThan("small")]: {
    position: "relative",
  },
};

const MenuLink = ({ name, to, isActive }) => {
  return (
    <Link css={[style, isActive && activeStyle]} to={to}>
      {name}
      {isActive && <span css={activeAfterStyle} />}
    </Link>
  );
};

export default MenuLink;
