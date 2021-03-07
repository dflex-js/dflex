/* eslint-disable no-plusplus */

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ComponentBasedEvent, ContainerBasedEvent } from "./lists";
import TodoList from "./todo";

function App() {
  return (
    <Router>
      <Switch>
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
