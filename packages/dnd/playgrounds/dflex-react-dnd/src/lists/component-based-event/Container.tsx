/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";

interface Props {
  children: React.ReactNode;
  [x: string]: any;
}
const Container = ({ children, ...rest }: Props) => (
  <div {...rest}>{children}</div>
);

export default Container;
