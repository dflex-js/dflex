/* eslint-disable react/no-array-index-key */
import React from "react";
import { graphql, Link } from "gatsby";
import MDXRenderer from "gatsby-plugin-mdx/mdx-renderer";
import Layout from "../components/Layout";
import MetaTags from "../components/MetaTags";

import createCanonicalUrl from "../utils/createCanonicalUrl";

import { siteMetadata } from "../../config";
import { colors, media, sharedStyles } from "../theme";

import Container from "../components/Container";
import ExternalLinkSvg from "../components/ExternalLinkSvg";

const { title, description } = siteMetadata;

const sectionStyles = {
  marginTop: 20,
  marginBottom: 15,

  [media.greaterThan("medium")]: {
    marginTop: 60,
    marginBottom: 65,
  },
};

const headingStyles = {
  "&&": {
    marginBottom: 20,
  },
};

function HomeHeader() {
  return (
    <header
      css={{
        fontFamily: "georgia, serif",
        backgroundColor: colors.dark,
        color: colors.white,
      }}
    >
      <div
        css={{
          paddingTop: 45,
          paddingBottom: 10,

          [media.greaterThan("small")]: {
            paddingTop: 60,
            paddingBottom: 70,
          },

          [media.greaterThan("xlarge")]: {
            // paddingTop: 95,
            // paddingBottom: 85,
            maxWidth: 1500, // Positioning of background logo
            marginLeft: "auto",
            marginRight: "auto",
            position: "relative",
            "::before": {
              content: " ",
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              // backgroundImage: `url(${logoWhiteSvg})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "100% 100px",
              backgroundSize: "50% auto",
              opacity: 0.05,
            },
          },
        }}
      >
        <div
          css={{
            // Content should be above absolutely-positioned hero image
            position: "relative",
          }}
        >
          <Container>
            <h1
              css={{
                color: colors.logo,
                textAlign: "center",
                margin: 0,
                fontSize: 45,
                letterSpacing: "0.01em",
                [media.size("xsmall")]: {
                  fontSize: 30,
                },
                [media.greaterThan("xlarge")]: {
                  fontSize: 60,
                },
              }}
            >
              {title}
            </h1>
            <p
              css={{
                paddingTop: 15,
                textAlign: "center",
                fontSize: 24,
                letterSpacing: "0.01em",
                fontWeight: 200,

                [media.size("xsmall")]: {
                  fontSize: 16,
                  maxWidth: "12em",
                  marginLeft: "auto",
                  marginRight: "auto",
                },

                [media.greaterThan("xlarge")]: {
                  paddingTop: 20,
                  fontSize: 30,
                },
              }}
            >
              {description}
            </p>
          </Container>
        </div>
      </div>
    </header>
  );
}

function HomeContent({ allMdx }) {
  return (
    <Container>
      <div css={sharedStyles.markdown}>
        <section
          css={[
            sectionStyles,
            {
              [media.lessThan("medium")]: {
                marginTop: 0,
                marginBottom: 0,
                overflowX: "auto",
                paddingTop: 30,
                WebkitOverflowScrolling: "touch",
                position: "relative",
                maskImage:
                  "linear-gradient(to right, transparent, white 10px, white 90%, transparent)",
              },
            },
          ]}
        >
          <div
            css={{
              display: "flex",
              flexDirection: "row",

              [media.lessThan("medium")]: {
                display: "block",
                whiteSpace: "nowrap",
              },
            }}
          >
            {allMdx.edges.map(({ node: { body, frontmatter } }, index) => {
              return (
                <div
                  key={index}
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    flex: "0 1 33%",
                    marginLeft: 40,

                    "&:first-of-type": {
                      marginLeft: 0,

                      [media.lessThan("medium")]: {
                        marginLeft: 10,
                      },
                    },

                    [media.lessThan("medium")]: {
                      display: "inline-block",
                      verticalAlign: "top",
                      marginLeft: 0,
                      whiteSpace: "normal",
                      width: "75%",
                      marginRight: 20,
                      paddingBottom: 40,

                      "&:first-of-type": {
                        marginTop: 0,
                      },
                    },
                  }}
                >
                  <Link
                    css={[
                      {
                        background: "none !important",
                        borderBottom: "none !important",
                      },
                      headingStyles,
                      {
                        "&&": {
                          // Make specificity higher than the site-wide h3 styles.
                          color: colors.subtle,
                          paddingTop: 0,
                          fontWeight: 300,
                          fontSize: 20,

                          [media.greaterThan("xlarge")]: {
                            fontSize: 24,
                          },
                        },
                      },
                    ]}
                    to={frontmatter.next}
                  >
                    {frontmatter.title}
                    <ExternalLinkSvg
                      cssProps={{
                        marginLeft: 5,
                        verticalAlign: -2,
                        color: colors.primary,
                      }}
                    />
                  </Link>
                  <div>
                    <MDXRenderer>{body}</MDXRenderer>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Container>
  );
}

function Home({ data, location }) {
  const { allMdx } = data;
  return (
    <Layout location={location}>
      <MetaTags
        title={`${title} - ${description}`}
        canonicalUrl={createCanonicalUrl("/")}
      />
      <div
        css={{
          width: "100%",
        }}
      >
        <HomeHeader />
        <HomeContent allMdx={allMdx} />
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query IndexMarkdown {
    allMdx(
      filter: {fileAbsolutePath: {regex: "\"//home/"}},
      sort: {fields: frontmatter___order, order: ASC}) {
        edges {
          node {
            body
            frontmatter {
              title
              next
            }
          }
        }
    }
  }
`;

export default Home;
