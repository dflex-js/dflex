import React from "react";

import "../essential/List.css";

import { Core } from "../essential/component-based-event";

const firstContainer = [{ label: "container1 |> elm-1", id: "unregistered-1" }];

const secondContainer = [
  { label: "container2 |> elm-1", id: "unregistered-2" },
  { label: "container2 |> elm-2", id: "unregistered-3" },
  { label: "container2 |> elm-3", id: "unregistered-4" },
  { label: "container2 |> elm-4", id: "unregistered-5" },
  { label: "container2 |> elm-5", id: "unregistered-6" },
  { label: "container2 |> elm-6", id: "unregistered-7" },
  { label: "container2 |> elm-7", id: "unregistered-8" },
];

const thirdContainer = [
  { label: "container3 |> elm-1", id: "unregistered-9" },
  { label: "container3 |> elm-2", id: "unregistered-10" },
  { label: "container3 |> elm-3", id: "unregistered-11" },
  { label: "container3 |> elm-4", id: "unregistered-12" },
];

const ID_PARENT_1 = "p1";
const ID_PARENT_2 = "p2";
const ID_PARENT_3 = "p3";

const UnRegisteredLists = () => (
  <div className="list-container list-height-fit">
    <ul id={`id-${ID_PARENT_1}`}>
      {firstContainer.map(({ label, id }) => (
        <Core depth={0} id={`id-${id}`} key={`k${id}`} component="li">
          {label}
        </Core>
      ))}
    </ul>
    <ul id={`id-${ID_PARENT_2}`}>
      {secondContainer.map(({ label, id }) => (
        <Core depth={0} id={`id-${id}`} key={`k-${id}`} component="li">
          {label}
        </Core>
      ))}
    </ul>
    <ul id={`id-${ID_PARENT_3}`}>
      {thirdContainer.map(({ label, id }) => (
        <Core depth={0} id={`id-${id}`} key={`k-${id}`} component="li">
          {label}
        </Core>
      ))}
    </ul>
  </div>
);

export default UnRegisteredLists;
