/* eslint-disable camelcase */
const path = require("path");

// Parse date information out of blog post filename.

function buildRedirectString(permalink, redirect_from) {
  if (!permalink || !permalink.endsWith(".html")) {
    return redirect_from ? JSON.stringify(redirect_from) : "";
  }

  const basePath = permalink.slice(0, -".html".length);
  let redirects = [basePath, `${basePath}/`];
  if (Array.isArray(redirect_from)) {
    redirects = redirects.concat(redirect_from);
  }

  return JSON.stringify(redirects);
}

function onCreateNode({ node, actions, getNode }) {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const { permalink, redirect_from } = node.frontmatter;

    const { relativePath, sourceInstanceName } = getNode(node.parent);

    let slug = permalink;

    if (!slug) {
      // Assign md file name as slug
      slug = `/${relativePath.replace(".md", ".html")}`;
    }

    // Generate URL to view this content.
    createNodeField({
      node,
      name: "slug",
      value: slug,
    });

    // Generate a GitHub edit link.
    // this presumes that the name in gatsby-config.js refers to parent folder
    createNodeField({
      node,
      name: "path",
      value: path.join(sourceInstanceName, relativePath),
    });

    // Used by createPages() above to register redirects.
    createNodeField({
      node,
      name: "redirect",
      value: buildRedirectString(permalink, redirect_from),
    });
  }
}

module.exports = onCreateNode;
