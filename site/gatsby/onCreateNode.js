const path = require("path");

function onCreateNode({ node, actions, getNode }) {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const { relativePath, sourceInstanceName } = getNode(node.parent);

    const slug = `/${relativePath.replace(".md", ".html")}`;

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
  }
}

module.exports = onCreateNode;
