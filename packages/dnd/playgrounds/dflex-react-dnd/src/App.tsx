/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "@dflex/dnd";

import {
  RestrictedContainerAll,
  RestrictedContainerDiff,
  RestrictedSelf,
  TodoList,
  TodoListCase1,
  ExtendedList,
  Depth1,
  ComponentBasedEvent,
  ContainerBasedEvent,
  ScrollMulti,
  ScrollEssential,
  UnRegisteredLists,
  Trello,
} from "./components";

function App() {
  React.useEffect(() => {
    return () => {
      store.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/scroll-multi" element={<ScrollMulti />} />
        <Route path="/scroll" element={<ScrollEssential />} />
        <Route path="/extended" element={<ExtendedList />} />
        <Route
          path="/restricted-container-all"
          element={<RestrictedContainerAll />}
        />
        <Route
          path="/restricted-container-diff"
          element={<RestrictedContainerDiff />}
        />
        <Route path="/restricted-self" element={<RestrictedSelf />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/todo-case-1" element={<TodoListCase1 />} />
        <Route path="/todo-trello" element={<Trello />} />
        <Route path="/depth-1" element={<Depth1 />} />
        <Route path="/unregistered" element={<UnRegisteredLists />} />
        <Route
          path="/component-based-event"
          element={
            <ComponentBasedEvent
              isHorizontal={false}
              isIncludeOneContainer={false}
            />
          }
        />
        <Route
          path="/horizontal"
          element={
            <ContainerBasedEvent isHorizontal isIncludeOneContainer={false} />
          }
        ></Route>
        <Route
          path="/grid"
          element={
            <ContainerBasedEvent isHorizontal isIncludeOneContainer grid />
          }
        ></Route>
        <Route
          path="/"
          element={
            <ContainerBasedEvent
              isHorizontal={false}
              isIncludeOneContainer={false}
            />
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
