/* eslint-disable no-plusplus */
import React from "react";
import { DnDContainer, DnDElement } from "../components/DnD";

import "tailwindcss/tailwind.css";

const index = 1;

function App() {
  return (
    <>
      <DnDContainer className="Container" depth={1} component="ul">
        <DnDElement
          depth={0}
          id={`id-${index}`}
          key={`k${index}`}
          component="li"
        >
          Element-1
        </DnDElement>
        <DnDElement
          depth={0}
          id={`id-${index}`}
          key={`k${index}`}
          component="li"
        >
          Element-2
        </DnDElement>
        <DnDElement
          depth={0}
          id={`id-${index}`}
          key={`k${index}`}
          component="li"
        >
          Element-3
        </DnDElement>
      </DnDContainer>
    </>
  );
}

export default {
  title: "Drag and Drop",
  component: App,
  argTypes: {},
};

const Template = (args) => <App {...args} />;

export const SimpleList = Template.bind({});
SimpleList.args = {};
