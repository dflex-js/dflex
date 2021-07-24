/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {
  Restricted,
  TodoList,
  ExtendedList,
  Depth1,
  ComponentBasedEvent,
  ContainerBasedEvent,
} from "dflex-react-components";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/extended">
          <ExtendedList />
        </Route>
        <Route path="/restricted">
          <Restricted />
        </Route>
        <Route path="/todo">
          <TodoList />
        </Route>
        <Route path="/depth-1">
          <Depth1 />
        </Route>
        <Route path="/component-based-event">
          <ComponentBasedEvent />
        </Route>
        <Route path="/">
          <ContainerBasedEvent />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
