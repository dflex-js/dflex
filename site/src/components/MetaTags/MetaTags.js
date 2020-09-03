import React from "react";
import Helmet from "react-helmet";

const defaultDescription = "A JavaScript library for building user interfaces";

function MetaTags({ title, ogType, canonicalUrl, ogDescription }) {
  return (
    <Helmet title={title}>
      <meta property="og:title" content={title} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {/* <meta property="og:image" content="https:///logo-og.png" /> */}
      <meta
        property="og:description"
        content={ogDescription || defaultDescription}
      />
      <meta property="fb:app_id" content="623268441017527" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && (
        <link
          rel="alternate"
          href={defaultPage(canonicalUrl)}
          hrefLang="x-default"
        />
      )}
      {canonicalUrl && alternatePages(canonicalUrl)}
    </Helmet>
  );
}

export default MetaTags;
