/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Lists from "./Lists";
import DraggableSolo from "./DraggableSolo";
import DraggableHandler from "./DraggableHandler";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/draggable-handler">
          <DraggableHandler />
        </Route>

        <Route path="/draggable-solo">
          <DraggableSolo />
        </Route>

        <Route path="/">
          <Lists />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
