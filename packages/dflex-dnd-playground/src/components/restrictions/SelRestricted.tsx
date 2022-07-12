import React from "react";
import DFlexDnDComponent from "../DFlexDnDComponent";

const SelRestricted = () => {
  const items = [
    {
      id: "item-rest-left",
      item: "restricted left only",
      style: { width: "10rem", height: "1rem", marginLeft: "92px" },
      restrictions: {
        self: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-right",
      item: "restricted right only",
      style: { width: "12rem", height: "1.5rem", marginLeft: "22px" },
      restrictions: {
        self: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: false,
        },
      },
    },
    {
      id: "item-rest-left-right",
      item: "restricted left & right only",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
      restrictions: {
        self: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: false,
        },
      },
    },
    {
      id: "item-rest-top",
      item: "restricted top only",
      style: { width: "10rem", height: "1rem", marginLeft: "92px" },
      restrictions: {
        self: {
          allowLeavingFromTop: false,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-bottom",
      item: "restricted bottom only",
      style: { width: "12rem", height: "1.5rem", marginLeft: "22px" },
      restrictions: {
        self: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: false,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-top-bottom",
      item: "restricted top & bottom only",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
      restrictions: {
        self: {
          allowLeavingFromTop: false,
          allowLeavingFromBottom: false,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-all",
      item: "restricted all",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
      restrictions: {
        self: {
          allowLeavingFromTop: false,
          allowLeavingFromBottom: false,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: false,
        },
      },
    },
  ];

  return (
    <div className="root">
      <div className="todo">
        <ul>
          {items.map(({ id, style, item, restrictions }) => (
            <DFlexDnDComponent
              key={id}
              Component={"li"}
              registerInput={{ id }}
              style={style}
              opts={{
                restrictions,
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

export default SelRestricted;
