import React from "react";

import "./List.css";

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

interface props {
  Container:
    | typeof ContainerInComponentBasedEvent
    | typeof ContainerInContainerBasedEvent;

  Core: typeof CoreInComponentBasedEvent | typeof CoreInContainerBasedEvent;
  className?: string;
}

const BaseApp = ({
  Container,
  Core,
  className = "list-container list-height-fit",
}: props) => (
  <Container className={className}>
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

function ComponentBasedEvent({ className }: { className?: string }) {
  return (
    <BaseApp
      className={className}
      Core={CoreInComponentBasedEvent}
      Container={ContainerInComponentBasedEvent}
    />
  );
}

function ContainerBasedEvent({ isHorizontal }: { isHorizontal?: boolean }) {
  return (
    <BaseApp
      className={isHorizontal ? "list-container-horizontal" : undefined}
      Core={CoreInContainerBasedEvent}
      Container={ContainerInContainerBasedEvent}
    />
  );
}

export { ComponentBasedEvent, ContainerBasedEvent };
