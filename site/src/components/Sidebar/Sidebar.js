/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
import React from "react";
import Flex from "../Flex";

import { media } from "../../theme";

function SectionComponent() {
  return <div />;
}

function Sidebar({ sectionList, location, createLink }) {
  return (
    <Flex
      Component="nav"
      direction="column"
      alignItems="stretch"
      css={{
        background: "red !important",
        width: "100%",
        paddingLeft: 20,
        position: "relative",

        [media.greaterThan("largerSidebar")]: {
          paddingLeft: 40,
        },

        [media.lessThan("small")]: {
          paddingBottom: 100,
        },
      }}
    >
      {sectionList.map((listItem, index) => (
        <SectionComponent
          createLink={createLink}
          isActive={false}
          key={index}
          location={location}
          onLinkClick={() => {
            console.log(`link clicked`);
          }}
          onSectionTitleClick={() => {
            console.log(`onSectionTitleClick clicked`);
          }}
          section={listItem}
        />
      ))}
    </Flex>
  );
}

export default Sidebar;
