/* eslint-disable no-plusplus */

import React from "react";
// @ts-expect-error
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Basic from "./horizontal/list/Basic";

import { ComponentBasedEvent, ContainerBasedEvent } from "./lists";
import Restricted from "./restrictions";
import TodoList from "./todo";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/h-basic">
          <Basic />
        </Route>
        <Route path="/restricted">
          <Restricted />
        </Route>
        <Route path="/todo">
          <TodoList />
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
