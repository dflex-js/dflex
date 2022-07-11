import React from "react";
import DFlexDnDComponent from "../DFlexDnDComponent";

const AllRestrictedContainer = () => {
  const items = [
    {
      id: "item-rest-1",
      item: "1",
      style: { width: "10rem", height: "2rem", marginLeft: "92px" },
    },
    {
      id: "item-rest-2",
      item: "2",
      style: { width: "12rem", height: "2.5rem", marginLeft: "22px" },
    },
    {
      id: "item-rest-3",
      item: "3",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
    },
    {
      id: "item-rest-4",
      item: "4",
      style: { width: "13rem", height: "3rem", marginLeft: "12px" },
    },
    {
      id: "item-rest-5",
      item: "5",
      style: { width: "18rem", height: "0.25rem" },
    },
  ];

  return (
    <div className="root">
      <div className="todo">
        <ul>
          {items.map(({ id, style, item }) => (
            <DFlexDnDComponent
              key={id}
              Component={"li"}
              registerInput={{ id }}
              style={style}
              opts={{
                restrictions: {
                  container: {
                    allowLeavingFromBottom: false,
                    allowLeavingFromTop: false,
                    allowLeavingFromLeft: false,
                    allowLeavingFromRight: false,
                  },
                },
              }}
            >
              {item}
            </DFlexDnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllRestrictedContainer;
