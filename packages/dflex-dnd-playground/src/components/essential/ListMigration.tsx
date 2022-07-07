import React from "react";

import "./List.css";

import { store } from "@dflex/dnd";
import { Core, Container } from "./component-based-event";

const firstContainer = [
  {
    style: {
      height: "60px",
    },
    label: "container1 |> elm-1",
    id: "c1-1",
  },
];

const secondContainer = [
  { style: {}, label: "container2 |> elm-1", id: "c2-1" },
  { style: {}, label: "container2 |> elm-2", id: "c2-2" },
  { style: {}, label: "container2 |> elm-3", id: "c2-3" },
  { style: {}, label: "container2 |> elm-4", id: "c2-4" },
  { style: {}, label: "container2 |> elm-5", id: "c2-5" },
];

const thirdContainer = [
  {
    style: {
      height: "80px",
    },
    label: "container3 |> elm-1",
    id: "c3-1",
  },
  {
    style: {
      height: "80px",
    },
    label: "container3 |> elm-2",
    id: "c3-2",
  },
];

const ID_PARENT_1 = "p1";
const ID_PARENT_2 = "p2";
const ID_PARENT_3 = "p3";

interface Props {
  withCommitBtn?: boolean;
}

const ListMigration = ({ withCommitBtn }: Props) => {
  return (
    <>
      <Container className="list-migration">
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
              id={id}
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
              id={id}
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
              id={id}
              key={`k-${id}`}
              component="li"
              style={style}
            >
              {label}
            </Core>
          ))}
        </Core>
        {withCommitBtn && (
          <button
            className="button-solo"
            onClick={() => {
              store.commit();
            }}
          >
            Commit
          </button>
        )}
      </Container>
    </>
  );
};

export default ListMigration;
