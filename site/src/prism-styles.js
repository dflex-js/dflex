import { css } from "glamor";

const prismColors = {
  background: "#282c34",
  white: "#ffffff",
  char: "#D8DEE9",
  comment: "#B2B2B2",
  keyword: "#c5a5c5",
  lineHighlight: "#353b45", // colors.dark + extra lightness
  primitive: "#5a9bcf",
  string: "#8dc891",
  variable: "#d7deea",
  boolean: "#ff8b50",
  punctuation: "#88C6BE",
  tag: "#fc929e",
  function: "#79b6f2",
  className: "#FAC863",
  method: "#6699CC",
  operator: "#fc929e",
};

css.global(".gatsby-highlight", {
  background: prismColors.background,
  color: prismColors.white,
  borderRadius: 10,
  overflow: "auto",
  tabSize: "1.5em",
  WebkitOverflowScrolling: "touch",
});

css.global(
  `
.gatsby-highlight > code[class*="gatsby-code-"],
.gatsby-highlight > pre[class*="gatsby-code-"],
.gatsby-highlight > pre.prism-code`,
  {
    height: "auto !important",
    margin: "1rem",
    fontSize: 14,
    lineHeight: "20px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  }
);

css.global(".gatsby-highlight + .gatsby-highlight", {
  marginTop: 20,
});

css.global(".gatsby-highlight-code-line", {
  backgroundColor: prismColors.lineHighlight,
  display: "block",
  margin: "-0.125rem calc(-1rem - 15px)",
  padding: "0.125rem calc(1rem + 15px)",
});

css.global(".token.attr-name", {
  color: prismColors.keyword,
});

css.global(
  `
.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata`,
  {
    color: prismColors.comment,
  }
);

css.global(
  `
.token.property,
.token.number,
.token.function-name,
.token.constant,
.token.symbol,
.token.deleted`,
  {
    color: prismColors.primitive,
  }
);

css.global(`.token.boolean`, {
  color: prismColors.boolean,
});

css.global(`.token.tag`, {
  color: prismColors.tag,
});

css.global(`.token.string`, {
  color: prismColors.string,
});

css.global(`.token.punctuation`, {
  color: prismColors.punctuation,
});

css.global(
  `
.token.selector,
.token.char,
.token.builtin,
.token.inserted`,
  {
    color: prismColors.char,
  }
);

css.global(`.token.function`, {
  color: prismColors.function,
});

css.global(
  `
.token.operator,
.token.entity,
.token.url,
.token.variable`,
  {
    color: prismColors.variable,
  }
);

css.global(".token.attr-value", {
  color: prismColors.string,
});

css.global(".token.keyword", {
  color: prismColors.keyword,
});

css.global(
  `
.token.atrule,
.token.class-name`,
  {
    color: prismColors.className,
  }
);

css.global(".token.important", {
  fontWeight: 400,
});

css.global(".token.bold", {
  fontWeight: 700,
});
css.global(".token.italic", {
  fontStyle: "italic",
});

css.global(".token.entity", {
  cursor: "help",
});

css.global(".namespace", {
  opacity: 0.7,
});
