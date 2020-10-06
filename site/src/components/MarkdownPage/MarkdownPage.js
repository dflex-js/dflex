import React from "react";
import MDXRenderer from "gatsby-plugin-mdx/mdx-renderer";

import createCanonicalUrl from "../../utils/createCanonicalUrl";

import Flex from "../Flex";
import Container from "../Container";

import MetaTags from "../MetaTags";
import MarkdownHeader from "../MarkdownHeader";

import { sharedStyles } from "../../theme";
import Sidebar from "../Sidebar";

function MarkdownPage({
  description,
  location,
  mdx: {
    frontmatter: { title },
    fields: { slug },
    body,
  },
}) {
  return (
    <Flex
      direction="column"
      grow="1"
      shrink="0"
      alignItems="stretch"
      css={{
        width: "100%",
        flex: "1 0 auto",
        position: "relative",
        zIndex: 0,
      }}
    >
      <MetaTags
        description={description}
        type="article"
        url={createCanonicalUrl(slug)}
        title={title}
      />
      <div css={{ flex: "1 0 auto" }}>
        <Container>
          <div css={sharedStyles.articleLayout.container}>
            <Flex Component="article" direction="column" grow="1">
              <MarkdownHeader title={title} />

              <div css={sharedStyles.articleLayout.content}>
                <div css={[sharedStyles.markdown]}>
                  <MDXRenderer>{body}</MDXRenderer>
                </div>
              </div>
            </Flex>

            <div css={sharedStyles.articleLayout.sidebar}>
              <Sidebar location={location} />
            </div>
          </div>
        </Container>
      </div>
    </Flex>
  );
}

export default MarkdownPage;
