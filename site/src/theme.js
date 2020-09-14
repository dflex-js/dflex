import hex2rgba from "hex2rgba";

const colors = {
  primary: "#6d4c41",
  dark: "#40241a",
  light: "#9c786c",

  text: "#1a1a1a", // very dark grey / black substitute
  subtle: "#6d6d6d", // light grey for text
  subtleOnDark: "#999",
  divider: "#ececec", // very light grey

  note: "#ffe564", // yellow
  error: "#ff6464", // yellow

  logo: "#ffff8d",
  white: "#ffffff",
  black: "#000000",
};

const SIZES = {
  xsmall: { min: 0, max: 599 },
  small: { min: 600, max: 779 },
  medium: { min: 780, max: 979 },
  large: { min: 980, max: 1279 },
  xlarge: { min: 1280, max: 1339 },
  xxlarge: { min: 1340, max: Infinity },

  // Sidebar/nav related tweakpoints
  largerSidebar: { min: 1100, max: 1339 },
  sidebarFixed: { min: 2000, max: Infinity },

  // Topbar related tweakpoints
  expandedSearch: { min: 1180, max: Infinity },
};

const media = {
  between(smallKey, largeKey, excludeLarge) {
    if (excludeLarge) {
      return `@media (min-width: ${SIZES[smallKey].min}px) and (max-width: ${
        SIZES[largeKey].min - 1
      }px)`;
    }
    if (SIZES[largeKey].max === Infinity) {
      return `@media (min-width: ${SIZES[smallKey].min}px)`;
    }
    return `@media (min-width: ${SIZES[smallKey].min}px) and (max-width: ${SIZES[largeKey].max}px)`;
  },

  greaterThan(key) {
    return `@media (min-width: ${SIZES[key].min}px)`;
  },

  lessThan(key) {
    return `@media (max-width: ${SIZES[key].min - 1}px)`;
  },

  size(key) {
    const size = SIZES[key];

    if (size.min == null) {
      return media.lessThan(key);
    }
    if (size.max == null) {
      return media.greaterThan(key);
    }
    return media.between(key, key);
  },
};

const fonts = {
  header: {
    fontSize: 60,
    lineHeight: "65px",
    fontWeight: 700,

    [media.lessThan("small")]: {
      overflowWrap: "break-word",
      wordBreak: "break-word",
    },

    [media.lessThan("medium")]: {
      fontSize: 40,
      lineHeight: "45px",
    },
  },
};

const linkStyle = {
  backgroundColor: hex2rgba(colors.logo, 0.3),
  borderBottom: `1px solid ${hex2rgba(colors.black, 0.2)}`,
  color: colors.text,

  ":hover": {
    backgroundColor: colors.logo,
    borderBottomColor: colors.text,
  },
};

const sharedStyles = {
  link: linkStyle,

  articleLayout: {
    container: {
      display: "flex",
      minHeight: "calc(100vh - 60px)",
      [media.greaterThan("sidebarFixed")]: {
        maxWidth: 840,
        marginLeft: "auto",
        marginRight: "auto",
      },
      [media.lessThan("small")]: {
        flexDirection: "column",
      },
    },
    content: {
      marginTop: 40,
      marginBottom: 120,

      [media.greaterThan("medium")]: {
        marginTop: 50,
      },
    },
    sidebar: {
      display: "flex",
      flexDirection: "column",

      [media.between("small", "sidebarFixed")]: {
        borderLeft: "1px solid #ececec",
        marginLeft: 80,
      },

      [media.between("small", "largerSidebar")]: {
        flex: "0 0 200px",
        marginLeft: 80,
      },

      [media.between("small", "medium")]: {
        marginLeft: 40,
      },

      [media.greaterThan("largerSidebar")]: {
        flex: "0 0 300px",
      },

      [media.greaterThan("sidebarFixed")]: {
        position: "fixed",
        right: 0,
        width: 300,
        zIndex: 2,
      },
    },
    feedbackButton: {
      border: 0,
      background: "none",
      cursor: "pointer",
      ":focus": {
        color: colors.text,
        borderColor: colors.text,
        "& svg": {
          fill: colors.text,
        },
      },
      ":hover": {
        color: colors.text,
        borderColor: colors.text,
        "& svg": {
          fill: colors.text,
        },
      },
      "& svg": {
        height: "1.5em",
        width: "1.5em",
        fill: colors.subtle,
        transition: "fill 0.2s ease",
      },
    },
    editLink: {
      color: colors.lighter,
      borderColor: colors.divider,
      transition: "color 0.2s ease, border-color 0.2s ease",
      whiteSpace: "nowrap",
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      ":hover": {
        color: colors.text,
        borderColor: colors.text,
      },
      ":focus": {
        color: colors.text,
        borderColor: colors.text,
      },
    },
  },

  markdown: {
    lineHeight: "25px",

    "& .gatsby-highlight": {
      marginTop: 25,
      marginLeft: -30,
      marginRight: -30,
      marginBottom: 25,
      paddingLeft: 15,
      paddingRight: 15,

      [media.lessThan("small")]: {
        marginLeft: -20,
        marginRight: -20,
        borderRadius: 0,
      },
    },

    "& a:not(.anchor):not(.gatsby-resp-image-link)": linkStyle,

    "& > p:first-child": {
      fontSize: 18,
      fontWeight: 300,
      color: colors.subtle,

      [media.greaterThan("xlarge")]: {
        fontSize: 24,
      },

      "& a, & strong": {
        fontWeight: 400,
      },
    },

    "& p": {
      marginTop: 30,
      fontSize: 17,
      lineHeight: 1.7,
      maxWidth: "42em",

      "&:first-of-type": {
        marginTop: 15,
      },

      "&:first-child": {
        marginTop: 0,
      },

      [media.lessThan("large")]: {
        fontSize: 16,
        marginTop: 25,
      },
    },

    "& h3 + p, & h3 + p:first-of-type": {
      marginTop: 20,
    },

    "& p > code, & li > code": {
      background: hex2rgba(colors.note, 0.2),
      color: colors.text,
    },

    "& p > code, & li > code, & p > a > code, & li > a > code": {
      padding: "0 3px",
      fontSize: "0.94em", // 16px on 17px text, smaller in smaller text
      wordBreak: "break-word",
    },

    "& hr": {
      height: 1,
      marginBottom: -1,
      border: "none",
      borderBottom: `1px solid ${colors.divider}`,
      marginTop: 40,

      ":first-child": {
        marginTop: 0,
      },
    },

    "& h1": {
      lineHeight: 1.2,

      [media.size("xsmall")]: {
        fontSize: 30,
      },

      [media.between("small", "large")]: {
        fontSize: 45,
      },

      [media.greaterThan("xlarge")]: {
        fontSize: 60,
      },
    },

    "& h2": {
      "::before": {
        content: " ",
        display: "block",
        borderBottom: `1px solid ${colors.divider}`,
        paddingTop: 44,
        marginBottom: 40,
      },

      lineHeight: 1.2,

      ":first-child": {
        "::before": {
          content: " ",
          display: "block",
          borderBottom: 0,
          paddingTop: 40,
          marginTop: -80,
        },
      },

      [media.lessThan("large")]: {
        fontSize: 20,
      },
      [media.greaterThan("xlarge")]: {
        fontSize: 35,
      },
    },

    "& hr + h2": {
      borderTop: 0,
      marginTop: 0,
    },

    "& h3": {
      "::before": {
        content: " ",
        display: "block",
        paddingTop: 90,
        marginTop: -45,
      },

      [media.lessThan("small")]: {
        overflowWrap: "break-word",
        wordBreak: "break-word",
      },

      [media.greaterThan("xlarge")]: {
        fontSize: 25,
        lineHeight: 1.3,
      },
    },

    "& h2 + h3, & h2 + h3:first-of-type": {
      "::before": {
        content: " ",
        display: "block",
        paddingTop: 60,
        marginTop: -30,
      },
    },

    "& h4": {
      "::before": {
        content: " ",
        display: "block",
        paddingTop: 100,
        marginTop: -50,
      },

      fontSize: 20,
      color: colors.subtle,
      lineHeight: 1.3,
      fontWeight: 400,
    },

    "& h4 + p": {
      marginTop: 20,
    },

    "& ol, & ul": {
      marginTop: 20,
      fontSize: 16,
      color: colors.text,
      paddingLeft: 20,

      "& p, & p:first-of-type": {
        fontSize: 16,
        marginTop: 0,
        lineHeight: 1.2,
      },

      "& li": {
        marginTop: 10,
      },

      "& li.button-newapp": {
        marginTop: 0,
      },

      "& ol, & ul": {
        marginLeft: 20,
        marginTop: 10,
      },
    },

    "& img": {
      maxWidth: "100%",
    },

    "& ol": {
      listStyle: "decimal",
    },

    "& ul": {
      listStyle: "disc",
    },

    "& blockquote": {
      backgroundColor: hex2rgba("#ffe564", 0.3),
      borderLeftColor: colors.note,
      borderLeftWidth: 9,
      borderLeftStyle: "solid",
      padding: "20px 45px 20px 26px",
      marginBottom: 30,
      marginTop: 20,
      marginLeft: -30,
      marginRight: -30,

      [media.lessThan("small")]: {
        marginLeft: -20,
        marginRight: -20,
      },

      "& p": {
        marginTop: 15,

        "&:first-of-type": {
          fontWeight: 700,
          marginTop: 0,
        },

        "&:nth-of-type(2)": {
          marginTop: 0,
        },
      },

      "& .gatsby-highlight": {
        marginLeft: 0,
      },
    },

    "& .gatsby-highlight + blockquote": {
      marginTop: 40,
    },

    "& .gatsby-highlight + h4": {
      "::before": {
        content: " ",
        display: "block",
        paddingTop: 85,
        marginTop: -60,
      },
    },
  },
};

export { colors, fonts, media, sharedStyles };
