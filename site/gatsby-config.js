const config = require("./config");

module.exports = {
  pathPrefix: config.gatsby.pathPrefix,
  siteMetadata: {
    title: config.siteMetadata.title,
    description: config.siteMetadata.description,
    author: config.siteMetadata.author,
    siteUrl: config.siteUrl,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-emotion`,
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
        trackingId: config.trackingId,
        head: true,
        anonymize: false,
      },
    },
  ],
};
