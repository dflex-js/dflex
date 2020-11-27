/* eslint-disable no-plusplus */
import React from "react";
import "./App.css";

import Core from "./Core";
import Container from "./Container";

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

function App() {
  return (
    <Container className="Container">
      <Core id="p0-a" component="ul" depth={1}>
        {firstContainer.map(({ label, id }) => (
          <Core depth={0} id={`id-${id}`} key={`k${id}`} component="li">
            {label}
          </Core>
        ))}
      </Core>
      <Core id="p0-1b" component="ul" depth={1}>
        {secondContainer.map(({ label, id }) => (
          <Core depth={0} id={`id-${id}`} key={`k-${id}`} component="li">
            {label}
          </Core>
        ))}
      </Core>
      <Core id="p0-1c" component="ul" depth={1}>
        {thirdContainer.map(({ label, id }) => (
          <Core depth={0} id={`id-${id}`} key={`k-${id}`} component="li">
            {label}
          </Core>
        ))}
      </Core>
    </Container>
  );
}

export default App;
