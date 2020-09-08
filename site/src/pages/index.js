import React from "react";
import Layout from "../components/Layout";
import MetaTags from "../components/MetaTags/MetaTags";

import createCanonicalUrl from "../utils/createCanonicalUrl";

import { siteMetadata } from "../../config";
import { colors, media } from "../theme";
import Container from "../components/Container";

const { title, description } = siteMetadata;

function Home({ location }) {
  return (
    <Layout location={location}>
      <MetaTags
        title={`${title}: ${description}`}
        canonicalUrl={createCanonicalUrl("/")}
      />
      <div
        css={{
          width: "100%",
        }}
      >
        <header
          css={{
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
                paddingTop: 95,
                paddingBottom: 85,
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
                    color: colors.brand,
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
      </div>
    </Layout>
  );
}

export default Home;
