import React from "react";

import { graphql } from "gatsby";

import Layout from "../components/Layout";
import MarkdownPage from "../components/MarkdownPage";

const Docs = ({ data, location }) => {
  if (!data) {
    return null;
  }

  const { mdx } = data;

  return (
    <Layout location={location}>
      <MarkdownPage
        mdx={mdx}
        location={location}
        createLink={() => {}}
        sectionList={[]}
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  query TemplateDocsMdx($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      frontmatter {
        title
        next
        prev
      }
      fields {
        path
        redirect
      }
    }
  }
`;

export default Docs;
