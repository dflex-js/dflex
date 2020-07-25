/* eslint-disable no-plusplus */
import React from "react";
import "./App.css";

import Core from "./Core";
import Container from "./Container";

let index = 1;

function App() {
  return (
    <Container className="Container">
      <Core id="p0-a" component="ul" depth={1}>
        {[1].map(() => (
          <Core depth={0} id={`id-${index}`} key={`k${index}`} component="li">
            Hello-
            {index++}
          </Core>
        ))}
      </Core>
      <Core id="p0-1b" component="ul" depth={1}>
        {[1, 2, 3, 4, 5, 6, 7].map(() => (
          <Core depth={0} id={`id-${index}`} key={`k${index}`} component="li">
            Hello-
            {index++}
          </Core>
        ))}
      </Core>
      <Core id="p0-1c" component="ul" depth={1}>
        {[1, 2, 3, 4].map(() => (
          <Core depth={0} id={`id-${index}`} key={`k${index}`} component="li">
            Hello-
            {index++}
          </Core>
        ))}
      </Core>
    </Container>
  );
}

export default App;
