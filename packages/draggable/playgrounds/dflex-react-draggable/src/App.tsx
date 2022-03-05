import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DraggableSolo from "./DraggableSolo";
import DraggableHandler from "./DraggableHandler";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/draggable-handler" element={<DraggableHandler />}></Route>
        <Route path="/" element={<DraggableSolo />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
