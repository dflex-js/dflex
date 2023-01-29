import React from "react";
// import type { LayoutStateEvent } from "@dflex/dnd";

import DFlexDnDComponent from "../DFlexDnDComponent";

const NUM_INTERVAL = 1;

const rowMap = {
  0: 5,
  1: 10,
  2: 15,
  3: 20,
  4: 25,
};

const TodoListWithEvents = () => {
  const [todo, updateTodo] = React.useState<
    {
      msg: string;
      id: string;
      key: string;
    }[]
  >([{ msg: "1", id: "1", key: "1" }]);

  const intervalID = React.useRef<ReturnType<typeof setInterval>>();

  const numberOfUpdates = React.useRef(0);

  React.useEffect(() => {
    intervalID.current = setInterval(() => {
      // @ts-ignore - TODO: Fix the type issue.
      const arr = new Array(rowMap[numberOfUpdates.current])

        .fill(null)
        .map((_v, i) => {
          const unique = `${numberOfUpdates.current}-${i}`;

          return {
            msg: unique,
            id: unique,
            key: unique,
          };
        });

      updateTodo(arr);

      numberOfUpdates.current += 1;
    }, 9000);

    return () => {
      clearInterval(intervalID.current);
    };
  }, []);

  React.useEffect(() => {
    if (numberOfUpdates.current === NUM_INTERVAL) {
      clearInterval(intervalID.current);
    }
  }, [numberOfUpdates.current]);

  return (
    <div className="root">
      <div className="todo">
        <ul>
          {todo.map(({ msg, id, key }) => (
            <DFlexDnDComponent
              Component={"li"}
              registerInput={{ id }}
              key={key}
            >
              {msg}
            </DFlexDnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoListWithEvents;
