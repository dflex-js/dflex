/* eslint-disable no-console */
const { resolve } = require("path");

async function createPages({ graphql, actions }) {
  const { createPage, createRedirect } = actions;

  // Used to detect and prevent duplicate redirects
  const redirectToSlugMap = {};

  const docsTemplate = resolve(__dirname, "../src/templates/docs.js");

  // Redirect /index.html to root.
  createRedirect({
    fromPath: "/index.html",
    redirectInBrowser: true,
    toPath: "/",
  });

  const allMdx = await graphql(
    `
      {
        allMdx(limit: 100) {
          edges {
            node {
              fields {
                path
                redirect
                slug
              }
            }
          }
        }
      }
    `
  );

  if (allMdx.errors) {
    // eslint-disable-next-line no-console
    console.error(allMdx.errors);

    throw Error(allMdx.errors);
  }

  allMdx.data.allMdx.edges.forEach((edge) => {
    const { slug } = edge.node.fields;

    const template = docsTemplate;

    createPage({
      path: slug,
      component: template,
      context: {
        slug,
      },
    });

    // Register redirects as well if the markdown specifies them.
    if (edge.node.fields.redirect) {
      let redirect = JSON.parse(edge.node.fields.redirect);
      if (!Array.isArray(redirect)) {
        redirect = [redirect];
      }

      redirect.forEach((fromPath) => {
        if (redirectToSlugMap[fromPath] != null) {
          console.error(
            `Duplicate redirect detected from "${fromPath}" to:\n` +
              `* ${redirectToSlugMap[fromPath]}\n` +
              `* ${slug}\n`
          );
          process.exit(1);
        }

        // A leading "/" is required for redirects to work,
        // But multiple leading "/" will break redirects.
        // For more context see github.com/reactjs/reactjs.org/pull/194
        const toPath = slug.startsWith("/") ? slug : `/${slug}`;

        redirectToSlugMap[fromPath] = slug;
        createRedirect({
          fromPath: `/${fromPath}`,
          redirectInBrowser: true,
          toPath,
        });
      });
    }
  });
}

module.exports = createPages;
