/* eslint-disable no-console */
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
  ScrollMultiLists,
  ListMigration,
  LayoutWithDroppable,
} from "./components";

function App() {
  React.useEffect(() => {
    const unsubscribeLayout = store.listeners.subscribe((e) => {
      console.info("new layout state", e);
    }, "layoutState");

    return () => {
      unsubscribeLayout();
    };
  }, []);

  React.useEffect(() => {
    const unsubscribeMutation = store.listeners.subscribe((e) => {
      console.info("new mutation state", e);
    }, "mutation");

    return () => {
      unsubscribeMutation();
    };
  }, []);

  React.useEffect(() => {
    return () => {
      store.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/scroll" element={<ScrollMultiLists />} />
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
        <Route path="/commit" element={<ListMigration withCommitBtn />} />
        <Route path="/droppable" element={<LayoutWithDroppable />} />
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
