import React from "react";
import Helmet from "react-helmet";

import config from "../../../config";

const {
  siteMetadata: { description: defaultDescription, ogImage, siteUrl },
} = config;

function MetaTags({
  title,
  ogType = "website",
  canonicalUrl,
  ogDescription = defaultDescription,
}) {
  return (
    <Helmet title={title}>
      <meta name="title" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:description" content={ogDescription} />
      <meta property="description" content={ogDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && (
        <link rel="alternate" href={siteUrl} hrefLang="x-default" />
      )}
    </Helmet>
  );
}

export default MetaTags;
