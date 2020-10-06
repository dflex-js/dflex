import React from "react";

import { graphql } from "gatsby";

import Layout from "../components/Layout";
import MarkdownPage from "../components/MarkdownPage";

const Docs = ({ data, location }) => {
  const {
    mdx: {
      body,
      frontmatter: { title },
      fields: { slug },
    },
  } = data;

  return (
    <Layout location={location}>
      <MarkdownPage title={title} slug={slug} body={body} location={location} />
    </Layout>
  );
};

export const pageQuery = graphql`
  query TemplateDocsMdx($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
`;

export default Docs;
