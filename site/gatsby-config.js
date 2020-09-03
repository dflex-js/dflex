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
        name: "docs",
        path: `${__dirname}/content/`,
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
        pathToConfigModule: "src/typography",
        defaultLayouts: {
          default: require.resolve("./src/templates/docs.js"),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1035,
              sizeByPixelDensity: true,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
          },
        ],
        extensions: [`.mdx`, `.md`],
      },
    },
    // {
    //   resolve: `gatsby-plugin-page-creator`,
    //   options: {
    //     path: `${__dirname}/src/pages`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: "UA-167775444-1",
        head: true,
        anonymize: false,
      },
    },

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
