import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";

const TitleAndMeta = ({
  title,
  author,
  url,
  type = "website",
  description,
  ogImage,
}) => {
  const {
    site: {
      siteMetadata: {
        siteUrl,
        title: siteName,
        description: defaultDescription,
        author: { name: defaultAuthorName },
      },
    },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
          title
          description
          author {
            name
          }
        }
      }
    }
  `);

  const canonicalUrl = url || siteUrl;
  const renderDesc = description || defaultDescription;
  const renderTitle = title
    ? `${siteName} - ${title}`
    : `${siteName} - ${defaultDescription}`;
  const renderAuthor = author || defaultAuthorName;

  console.log("canonicalUrl", canonicalUrl);

  return (
    <Helmet title={renderTitle}>
      <meta
        name="google-site-verification"
        content="C7SmJ-skNziVPE1xVRqGnj7MplLbtGcdV3WdbQ1pS-c"
      />
      <meta name="title" content={renderTitle} />
      <meta name="description" content={renderDesc} />
      <meta property="og:title" content={renderTitle} />
      <meta property="og:description" content={renderDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" href={siteUrl} hrefLang="ar" />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content={renderAuthor} />
      <meta property="twitter:title" content={renderTitle} />
      <meta property="twitter:description" content={renderDesc} />
      <meta name="twitter:domain" content={siteUrl} />
    </Helmet>
  );
};

export default TitleAndMeta;
