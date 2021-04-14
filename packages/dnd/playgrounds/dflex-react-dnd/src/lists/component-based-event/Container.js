/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";

const Container = ({
  component: ContainerComponent = "div",
  children,
  ...rest
}) => <ContainerComponent {...rest}>{children}</ContainerComponent>;

export default Container;
