/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { store } from "@dflex/dnd";

import {
  Restricted,
  TodoList,
  TodoListCase1,
  ExtendedList,
  Depth1,
  ComponentBasedEvent,
  ContainerBasedEvent,
} from "./components";

function App() {
  React.useEffect(() => {
    return () => {
      store.destroy();
    };
  }, []);

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
        <Route path="/todo-case-1">
          <TodoListCase1 />
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
