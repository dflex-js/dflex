/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "@dflex/dnd";

import {
  AllRestrictedContainer,
  SomeRestrictedContainer,
  SelRestricted,
  TodoList,
  TodoListWithEvents,
  TodoListWithReadonly,
  ComponentBasedEvent,
  ContainerBasedEvent,
  ExtendedList,
  ScrollMultiLists,
  ScrollablePage,
  WindowedDualList,
  ListMigration,
  StreamInterval,
  StreamNewELm,
  StreamIncremental,
  BigGap,
} from "./components";

const App = () => {
  const commitWhenKyPressed = (e: KeyboardEvent) => {
    if (e.key === "c") {
      store.commit();
    }
  };

  React.useEffect(() => {
    // The default optional config.
    store.config({
      enableEvents: true,
      enableListeners: true,
      removeEmptyContainer: false,
      enableDragSettleOnSwitch: true,
    });
  }, []);

  React.useEffect(() => {
    // For testing purpose only.
    document.addEventListener("keyup", commitWhenKyPressed);

    console.info("Press c to commit changed to DOM.");

    return () => {
      document.removeEventListener("keyup", commitWhenKyPressed);
    };
  }, []);

  React.useEffect(() => {
    if (!store.listeners) {
      return undefined;
    }

    const unsubscribe = store.listeners.subscribe((e) => {
      console.info("new layout state", e);
    }, "layoutState");

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (!store.listeners) {
      return undefined;
    }

    const unsubscribe = store.listeners.subscribe((e) => {
      console.info("new mutation state", e);
    }, "mutation");

    return () => {
      unsubscribe();
    };
  }, []);

  // React.useEffect(() => {
  //   const unsubscribe = store.listeners.subscribe((e) => {
  //     console.info("new DFlex error", e);
  //   }, "error");

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

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
        <Route path="/scrollable-page" element={<ScrollablePage />} />
        <Route path="/gap" element={<BigGap />} />

        <Route path="/windowed-dual-list" element={<WindowedDualList />} />
        <Route
          path="/restricted-container-all"
          element={<AllRestrictedContainer />}
        />
        <Route
          path="/restricted-container-diff"
          element={<SomeRestrictedContainer />}
        />
        <Route path="/restricted-self" element={<SelRestricted />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/todo-with-events" element={<TodoListWithEvents />} />
        <Route path="/migration" element={<ListMigration />} />
        <Route path="/commit" element={<ListMigration withCommitBtn />} />
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
        />
        <Route
          path="/grid"
          element={
            <ContainerBasedEvent isHorizontal isIncludeOneContainer grid />
          }
        />
        <Route path="/stream-interval" element={<StreamInterval />} />
        <Route path="/stream-new" element={<StreamNewELm />} />
        <Route path="/stream-inc" element={<StreamIncremental />} />
        <Route
          path="/"
          element={
            <ContainerBasedEvent
              isHorizontal={false}
              isIncludeOneContainer={false}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
