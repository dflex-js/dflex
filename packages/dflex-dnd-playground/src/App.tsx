/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "@dflex/dnd";

import {
  AllRestrictedContainer,
  SomeRestrictedContainer,
  SelRestricted,
  TodoListWithEvents,
  TodoListWithReadonly,
  ExtendedList,
  ComponentBasedEvent,
  ContainerBasedEvent,
  ScrollEssential,
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
        <Route path="/scroll" element={<ScrollEssential />} />
        <Route path="/extended" element={<ExtendedList />} />
        <Route
          path="/restricted-container-all"
          element={<AllRestrictedContainer />}
        />
        <Route
          path="/restricted-container-diff"
          element={<SomeRestrictedContainer />}
        />
        <Route path="/restricted-self" element={<SelRestricted />} />
        <Route path="/todo" element={<TodoListWithEvents />} />
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
        <Route path="/readonly" element={<TodoListWithReadonly />} />
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
