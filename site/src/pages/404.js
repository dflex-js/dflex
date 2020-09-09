/* eslint-disable react/no-unescaped-entities */
import React from "react";

import Layout from "../components/Layout";
import Container from "../components/Container";
import { sharedStyles } from "../theme";
import Header from "../components/LayoutHeader";
import MetaTags from "../components/MetaTags/MetaTags";

const NotFoundPage = () => (
  <Layout>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Page Not Found</Header>
          <MetaTags title="DFlex - Page Not Found" />
          <div css={sharedStyles.markdown}>
            <p>NOT FOUND</p>
            <p>You just hit a route that doesn't exist... the sadness.</p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default NotFoundPage;
