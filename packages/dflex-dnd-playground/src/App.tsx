/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "@dflex/dnd";

import {
  RestrictedContainerAll,
  RestrictedContainerDiff,
  RestrictedSelf,
  TodoList,
  ExtendedList,
  ComponentBasedEvent,
  ContainerBasedEvent,
  ScrollMulti,
  ScrollEssential,
  UnRegisteredLists,
  ListMigration,
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
        <Route path="/unregistered" element={<UnRegisteredLists />} />
        <Route path="/migration" element={<ListMigration />} />
        <Route
          path="/component-based-event"
          element={
            <ComponentBasedEvent
              isHorizontal={false}
              isIncludeOneContainer={false}
            />
          }
        />
        {/* <Route
          path="/readonly"
          element={
            <ComponentBasedEvent
              readonly={true}
              isHorizontal={false}
              isIncludeOneContainer={false}
            />
          }
        /> */}
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
