/* eslint-disable no-plusplus */
import React from "react";
import "./App.css";

import { Container, Draggable } from "./components";

<<<<<<< HEAD
=======

>>>>>>> master
let index = 1;

function App() {
  return (
    <Container className="Container">
      <Draggable id="p0-a" component="ul">
        {[1].map(() => (
          <Draggable id={`id-${index}`} key={`k${index}`} component="li">
            Hello-
            {index++}
          </Draggable>
        ))}
      </Draggable>
      <Draggable id="p0-1b" component="ul">
        {[1, 2, 3, 4, 5, 6, 7].map(() => (
          <Draggable id={`id-${index}`} key={`k${index}`} component="li">
            Hello-
            {index++}
          </Draggable>
        ))}
      </Draggable>
      <Draggable id="p0-1c" component="ul">
        {[1, 2, 3].map(() => (
          <Draggable id={`id-${index}`} key={`k${index}`} component="li">
            Hello-
            {index++}
          </Draggable>
        ))}
      </Draggable>
    </Container>
  );
}

export default App;
