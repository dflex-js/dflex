import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

const NUM_INTERVAL = 4;

const rowMap = {
  0: 5,
  1: 10,
  2: 15,
  3: 20,
  4: 25,
};

const StreamOnDemand = () => {
  const [todo, updateTodo] = React.useState<
    {
      msg: string;
      id: string;
      key: string;
    }[]
  >([{ msg: "1", id: "1", key: "1" }]);

  const numberOfUpdates = React.useRef(0);

  const refreshList = () => {
    if (numberOfUpdates.current === NUM_INTERVAL) {
      // eslint-disable-next-line no-console
      console.info(`Number of refreshing amount is ${NUM_INTERVAL}`);

      return;
    }

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
  };

  const commitWhenKyPressed = (e: KeyboardEvent) => {
    if (e.key === "r") {
      refreshList();
    }
  };

  React.useEffect(() => {
    // For testing purpose only.
    document.addEventListener("keyup", commitWhenKyPressed);

    // eslint-disable-next-line no-console
    console.info("Press r to refresh elements.");

    return () => {
      document.removeEventListener("keyup", commitWhenKyPressed);
    };
  }, []);

  return React.useMemo(
    () => (
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
    ),
    [todo]
  );
};

export default StreamOnDemand;
