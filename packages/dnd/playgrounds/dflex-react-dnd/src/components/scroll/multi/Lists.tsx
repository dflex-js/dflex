

import React from "react";

import { Container, Core } from "../../essential/component-based-event";
import "../../essential/List.css";

const firstContainer = [{ label: "container1 |> elm-1", id: "scroll-1" }];

const secondContainer = [
  { label: "container2 |> elm-1", id: "scroll-2" },
  { label: "container2 |> elm-2", id: "scroll-3" },
  { label: "container2 |> elm-3", id: "scroll-4" },
  { label: "container2 |> elm-4", id: "scroll-5" },
  { label: "container2 |> elm-5", id: "scroll-6" },
  { label: "container2 |> elm-6", id: "scroll-7" },
  { label: "container2 |> elm-7", id: "scroll-8" },
];

const thirdContainer = [
  { label: "container3 |> elm-1", id: "scroll-9" },
  { label: "container3 |> elm-2", id: "scroll-10" },
  { label: "container3 |> elm-3", id: "scroll-11" },
  { label: "container3 |> elm-4", id: "scroll-12" },
];

const ID_PARENT_1 = "scroll-p1";
const ID_PARENT_2 = "scroll-p2";
const ID_PARENT_3 = "scroll-p3";

const Lists = () => (
  <Container className="list-container list-container-scroll list-height-limited">
    <Core id={ID_PARENT_1} component="ul" depth={1}>
      {firstContainer.map(({ label, id }) => (
        <Core depth={0} id={id} key={`k${id}`} component="li">
          {label}
        </Core>
      ))}
    </Core>
    <Core id={ID_PARENT_2} component="ul" depth={1}>
      {secondContainer.map(({ label, id }) => (
        <Core depth={0} id={id} key={`k-${id}`} component="li">
          {label}
        </Core>
      ))}
    </Core>
    <Core id={ID_PARENT_3} component="ul" depth={1}>
      {thirdContainer.map(({ label, id }) => (
        <Core depth={0} id={id} key={`k-${id}`} component="li">
          {label}
        </Core>
      ))}
    </Core>
  </Container>
);

export default Lists;
