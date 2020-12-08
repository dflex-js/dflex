/* eslint-disable no-plusplus */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";

import {
  Core as CoreInContainerBasedEvent,
  Container as ContainerInContainerBasedEvent,
} from "./container-based-event";

import {
  Core as CoreInComponentBasedEvent,
  Container as ContainerInComponentBasedEvent,
} from "./component-based-event";

const firstContainer = [{ label: "container1 |> elm-1", id: "1" }];

const secondContainer = [
  { label: "container2 |> elm-1", id: "2" },
  { label: "container2 |> elm-2", id: "3" },
  { label: "container2 |> elm-3", id: "4" },
  { label: "container2 |> elm-4", id: "5" },
  { label: "container2 |> elm-5", id: "6" },
  { label: "container2 |> elm-6", id: "7" },
  { label: "container2 |> elm-7", id: "8" },
];

const thirdContainer = [
  { label: "container3 |> elm-1", id: "9" },
  { label: "container3 |> elm-2", id: "10" },
  { label: "container3 |> elm-3", id: "11" },
  { label: "container3 |> elm-4", id: "12" },
];

const ID_PARENT_1 = "p1";
const ID_PARENT_2 = "p2";
const ID_PARENT_3 = "p3";

const BaseApp = ({ Container, Core }) => {
  return (
    <Container className="container">
      <Core id={`id-${ID_PARENT_1}`} component="ul" depth={1}>
        {firstContainer.map(({ label, id }) => (
          <Core depth={0} id={`id-${id}`} key={`k${id}`} component="li">
            {label}
          </Core>
        ))}
      </Core>
      <Core id={`id-${ID_PARENT_2}`} component="ul" depth={1}>
        {secondContainer.map(({ label, id }) => (
          <Core depth={0} id={`id-${id}`} key={`k-${id}`} component="li">
            {label}
          </Core>
        ))}
      </Core>
      <Core id={`id-${ID_PARENT_3}`} component="ul" depth={1}>
        {thirdContainer.map(({ label, id }) => (
          <Core depth={0} id={`id-${id}`} key={`k-${id}`} component="li">
            {label}
          </Core>
        ))}
      </Core>
    </Container>
  );
};

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <BaseApp
            Core={CoreInContainerBasedEvent}
            Container={ContainerInContainerBasedEvent}
          />
        </Route>
        <Route path="/component-based-event">
          <BaseApp
            Core={CoreInComponentBasedEvent}
            Container={ContainerInComponentBasedEvent}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
