import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Lists from "./Lists";
import DraggableSolo from "./DraggableSolo";

function App() {
  return (
    <Router>
      <Switch>
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
