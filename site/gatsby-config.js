const config = require("./config");

const plugins = [
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
      icon: `static/favicon-32x32.png`,
    },
  },
  {
    resolve: "gatsby-plugin-mdx",
    options: {
      gatsbyRemarkPlugins: [
        `gatsby-remark-external-links`,
        `gatsby-remark-copy-linked-files`,
        // `gatsby-remark-autolink-headers`,
        // {
        //   resolve: "gatsby-remark-images",
        //   options: {
        //     maxWidth: 1035,
        //     sizeByPixelDensity: true,
        //   },
        // },
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
    },
  },
];

module.exports = {
  siteMetadata: { ...config },
  plugins,
};
