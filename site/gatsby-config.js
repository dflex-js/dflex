const path = require("path");

module.exports = {
  pathPrefix: "/dflex",
  siteMetadata: {
    title: `DFlex`,
    description: "A JavaScript ambitious project to manipulate DOM elements",
    author: `Jalal Maskoun`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: { config: path.resolve(__dirname, "config.js") },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `DFlex`,
        short_name: `DFlex`,
        start_url: `/`,
        background_color: "#40241a",
        theme_color: "#40241a",
        display: `minimal-ui`,
        // icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-glamor`,
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        gatsbyRemarkPlugins: [
          `gatsby-remark-external-links`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-autolink-headers`,
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1035,
              sizeByPixelDensity: true,
            },
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "gatsby-code-",
            },
          },
        ],
        extensions: [`.mdx`, `.md`],
      },
    },

    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: "UA-167775444-1",
        head: true,
        anonymize: false,
      },
    },
  ],
};
