/* eslint-disable no-plusplus */
import React from "react";
import { DnDContainer, DnDElement } from "../components/DnD";

import "../style/style.css";

// const index = 1;

function App() {
  return (
    <div className="flex items-center justify-center bg-white w-full">
      <div className="bg-yellow-100 p-7 w-9/12">
        <DnDContainer className="Container" depth={1}>
          <DnDElement depth={0} id="elm-1">
            Element-1
          </DnDElement>
          <DnDElement depth={0} id="elm-2">
            Element-2
          </DnDElement>
          <DnDElement depth={0} id="elm-3">
            Element-3
          </DnDElement>
        </DnDContainer>
      </div>
    </div>
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
