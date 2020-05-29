/* eslint-disable react/jsx-key */
import React from "react";

import Highlight, { defaultProps } from "prism-react-renderer";
import { MDXProvider } from "@mdx-js/react";
import codeTheme from "../code-theme";
import Container from "./ContainerLayout";

function pre({ children: { props } }) {
  const { className: cName, children } = props;

  const lang = cName && cName.split("-")[1];

  return (
    <div
      style={{
        width: "100% !important",
        marginBottom: "1.5rem",
        overflowX: "auto",
        "& pre": {
          overflowX: "auto",
          width: "100%",
          padding: 16,
        },
      }}
    >
      <Highlight
        {...defaultProps}
        theme={codeTheme}
        code={children.trim()}
        language={lang}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} css={{ marginBottom: 0 }} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

function blockquote(props) {
  return (
    <blockquote
      style={{
        width: "60%",
        // margin: "50px auto",
        fontStyle: "italic",
        color: "#555555",
        // padding: "1.2em 30px 1.2em 75px",
        borderLeft: "8px solid #78C0A8",
        background: "#EDEDED",
      }}
      {...props}
    />
  );
}

const components = { pre, blockquote };

function Main({ children }) {
  return (
    <Container>
      <main
        css={{
          margin: `0 auto`,
          marginTop: "95",
          width: "65%",
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <MDXProvider components={components}>{children}</MDXProvider>
      </main>
    </Container>
  );
}

export default Main;
