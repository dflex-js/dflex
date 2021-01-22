import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Lists from "./Lists";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Lists />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
