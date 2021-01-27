/* eslint-disable no-plusplus */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ComponentBasedEvent, ContainerBasedEvent } from "./lists";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <ContainerBasedEvent />
        </Route>
        <Route path="/component-based-event">
          <ComponentBasedEvent />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
