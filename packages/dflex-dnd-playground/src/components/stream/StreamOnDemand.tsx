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

const initStateA = [{ msg: "a-1", id: "a-1", key: "a-1" }];
const initStateB = [{ msg: "b-1", id: "b-1", key: "b-1" }];

const StreamOnDemand = () => {
  const [todoListA, updateTodoListA] = React.useState<
    {
      msg: string;
      id: string;
      key: string;
    }[]
  >(initStateA);

  const [todoListB, updateTodoListB] = React.useState<
    {
      msg: string;
      id: string;
      key: string;
    }[]
  >(initStateB);

  const numberOfUpdates = React.useRef(0);

  const refreshList = (listA: boolean) => {
    const pre = listA ? "a" : "b";

    // @ts-ignore - TODO: Fix the type issue.
    const arr = new Array(rowMap[numberOfUpdates.current])

      .fill(null)
      .map((_v, i) => {
        const unique = `${pre}-${numberOfUpdates.current}-${i}`;

        return {
          msg: unique,
          id: unique,
          key: unique,
        };
      });

    if (listA) {
      updateTodoListA(arr);
    } else {
      updateTodoListB(arr);
    }
  };

  const commitWhenKyPressed = (e: KeyboardEvent) => {
    if (e.key === "r") {
      if (numberOfUpdates.current === NUM_INTERVAL) {
        // eslint-disable-next-line no-console
        console.info(`Number of refreshing amount is ${NUM_INTERVAL}`);

        return;
      }

      refreshList(true);
      refreshList(false);

      numberOfUpdates.current += 1;
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
        <div
          className="todo"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "7px",
          }}
        >
          <ul>
            {todoListA.map(({ msg, id, key }) => (
              <DFlexDnDComponent
                Component={"li"}
                registerInput={{ id }}
                key={key}
              >
                {msg}
              </DFlexDnDComponent>
            ))}
          </ul>
          <ul>
            {todoListB.map(({ msg, id, key }) => (
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
    [todoListA]
  );
};

export default StreamOnDemand;
