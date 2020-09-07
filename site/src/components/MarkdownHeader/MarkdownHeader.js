import React from "react";
import Flex from "../Flex";

import { colors, fonts } from "../../theme";

function MarkdownHeader({ title }) {
  return (
    <Flex
      Component="header"
      justifyContent="space-between"
      alignItems="baseline"
    >
      <h1
        css={{
          color: colors.dark,
          marginBottom: 0,
          ...fonts.header,
        }}
      >
        {title}
      </h1>
    </Flex>
  );
}

export default MarkdownHeader;
