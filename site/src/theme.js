const colors = {
  primary: "#6d4c41",
  dark: "#40241a",
  light: "#9c786c",

  logo: "#ffff8d",
  white: "#ffffff",
  // black: "#000000",
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

export { colors, fonts, media };
