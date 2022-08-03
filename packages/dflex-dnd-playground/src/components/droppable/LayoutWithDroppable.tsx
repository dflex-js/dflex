import type { DFlexElmType } from "@dflex/dnd";
import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

type Container = {
  id: string;
  content: string;
  type: DFlexElmType;
  style: React.CSSProperties;
};

const container1: Container[] = [
  { id: "inter-elm-1", type: "interactive", content: "Inter-1", style: {} },
  {
    id: "inter-elm-2",
    type: "interactive",
    content: "Inter-2",
    style: {},
  },
  {
    id: "inter-elm-3",
    type: "interactive",
    content: "Inter-3",
    style: {},
  },
  { id: "inter-elm-4", type: "interactive", content: "Inter-4", style: {} },
  { id: "inter-elm-5", type: "interactive", content: "Inter-5", style: {} },
  { id: "inter-elm-6", type: "interactive", content: "Inter-6", style: {} },
  { id: "inter-elm-7", type: "interactive", content: "Inter-7", style: {} },
  { id: "inter-elm-8", type: "interactive", content: "Inter-8", style: {} },
  { id: "inter-elm-9", type: "interactive", content: "Inter-9", style: {} },
  { id: "inter-elm-10", type: "interactive", content: "Inter-10", style: {} },
];

const container2: Container = {
  id: "drop-elm-1",
  type: "droppable",
  content: "Droppable area 1",
  style: {},
};

const container3: Container = {
  id: "drop-elm-2",
  type: "droppable",
  content: "Droppable area 2",
  style: {},
};

const DFlexInteractive = ({ container }: { container: Container[] }) => (
  <ul>
    {container.map(({ content, id, type, style }) => (
      <DFlexDnDComponent
        Component={"li"}
        registerInput={{ id, type }}
        key={id}
        style={style}
      >
        {content}
      </DFlexDnDComponent>
    ))}
  </ul>
);

const DFlexDroppable = ({ content, id, style, type }: Container) => (
  <DFlexDnDComponent
    Component={"ul"}
    registerInput={{ id, type }}
    key={id}
    style={style}
  >
    <li>{content}</li>
  </DFlexDnDComponent>
);

const LayoutWithDroppable = () => {
  return (
    <div className="list-migration">
      <DFlexInteractive container={container1} />
      <DFlexDroppable {...container2} />
      <DFlexDroppable {...container3} />
    </div>
  );
};

export default LayoutWithDroppable;
