import React from "react";

import "./List.css";

import { Core, Container } from "./component-based-event";

const firstContainer = [
  {
    style: {
      height: "60px",
    },
    label: "container1 |> elm-1",
    id: "migrate-1",
  },
];

const secondContainer = [
  { style: {}, label: "container2 |> elm-1", id: "migrate-2" },
  { style: {}, label: "container2 |> elm-2", id: "migrate-3" },
  { style: {}, label: "container2 |> elm-3", id: "migrate-4" },
  { style: {}, label: "container2 |> elm-4", id: "migrate-5" },
  { style: {}, label: "container2 |> elm-5", id: "migrate-6" },
];

const thirdContainer = [
  {
    style: {
      height: "80px",
    },
    label: "container3 |> elm-1",
    id: "migrate-9",
  },
  {
    style: {},
    label: "container3 |> elm-2",
    id: "migrate-10",
  },
];

const ID_PARENT_1 = "p1";
const ID_PARENT_2 = "p2";
const ID_PARENT_3 = "p3";

// interface PropsBase {
//   isHorizontal: boolean;
//   grid?: boolean;
// }

const ListMigration = () => (
  <Container className={"list-migration"}>
    <Core
      enableContainersTransition
      id={`id-${ID_PARENT_1}`}
      component="ul"
      depth={1}
    >
      {firstContainer.map(({ label, id, style }) => (
        <Core
          enableContainersTransition
          depth={0}
          id={`id-${id}`}
          key={`k${id}`}
          component="li"
          style={style}
        >
          {label}
        </Core>
      ))}
    </Core>
    <Core
      enableContainersTransition
      id={`id-${ID_PARENT_2}`}
      component="ul"
      depth={1}
    >
      {secondContainer.map(({ label, id, style }) => (
        <Core
          enableContainersTransition
          depth={0}
          id={`id-${id}`}
          key={`k-${id}`}
          component="li"
          style={style}
        >
          {label}
        </Core>
      ))}
    </Core>
    <Core
      enableContainersTransition
      id={`id-${ID_PARENT_3}`}
      component="ul"
      depth={1}
    >
      {thirdContainer.map(({ label, id, style }) => (
        <Core
          enableContainersTransition
          depth={0}
          id={`id-${id}`}
          key={`k-${id}`}
          component="li"
          style={style}
        >
          {label}
        </Core>
      ))}
    </Core>
  </Container>
);

export default ListMigration;
