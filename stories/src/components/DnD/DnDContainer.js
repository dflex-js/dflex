/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */

import React from "react";

const DnDContainer = ({ children }) => {
  return (
    <ul className="flex flex-col items-center justify-center">{children}</ul>
  );
};

export default DnDContainer;
