/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "Vanilla JavaScript",
    imageUrl: "img/undraw_JavaScript_frameworks.svg",
    description: (
      <>
        DFlex is a JavaScript solution. It is not a solution for a specific
        framework. A pure JavaScript library. Every fix, feature, or enhancement
        will affect all framework implementations.
      </>
    ),
  },
  {
    title: "DOM Packages",
    imageUrl: "img/undraw_deliveries.svg",
    description: (
      <>
        DFlex is a collection of utility packages for DOM. Focused on
        performance and extensibility. All packages are decoupled. Work
        separately to prevent a bloated bundle in production and to make it
        easier to maintain.
      </>
    ),
  },
  {
    title: "No Lagging",
    imageUrl: "img/undraw_Access_account.svg",
    description: (
      <>
        DFlex is also extensible. In most existing solutions the more elements
        you are trying to manipulate the more lagging you get. With DFlex, no
        matter how many elements you are dealing with it’s always going to be
        smooth manipulation.
      </>
    ),
  },
  {
    title: "Native API",
    imageUrl: "img/undraw_smart_resize.svg",
    description: (
      <>
        DFlex is a solution to native-like browser API focused on performance
        and easy implementation.
      </>
    ),
  },
  {
    title: "Neat Architecture",
    imageUrl: "img/undraw_urban_design.svg",
    description: (
      <>
        DFlex has parent/children architecture. So you can manipulate a child or
        parent.
      </>
    ),
  },
  {
    title: "Combined With Your Solution",
    imageUrl: "img/undraw_moving_forward.svg",
    description: (
      <>
        Every node manipulation has calculated and exposed. So you can add your
        own functionality without starting from scratch.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={`${siteConfig.title}`} description={siteConfig.tagline}>
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title color-white">{siteConfig.title}</h1>
          <p className="hero__subtitle color-white">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--lg color-white",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
