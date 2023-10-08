import React from "react";
import DFlexDnDComponent from "../DFlexDnDComponent";

const SomeRestrictedContainer = () => {
  const items = [
    {
      id: "item-rest-container-left",
      item: "restricted left only",
      style: { width: "10rem", height: "1rem", marginLeft: "92px" },
      restrictions: {
        container: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-container-right",
      item: "restricted right only",
      style: { width: "12rem", height: "1.5rem", marginLeft: "22px" },
      restrictions: {
        container: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: false,
        },
      },
    },
    {
      id: "item-rest-container-left-right",
      item: "restricted left & right only",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
      restrictions: {
        container: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: false,
        },
      },
    },
    {
      id: "item-rest-container-top",
      item: "restricted top only",
      style: { width: "10rem", height: "1rem", marginLeft: "92px" },
      restrictions: {
        container: {
          allowLeavingFromTop: false,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-container-bottom",
      item: "restricted bottom only",
      style: { width: "12rem", height: "1.5rem", marginLeft: "22px" },
      restrictions: {
        container: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: false,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-container-top-bottom",
      item: "restricted top & bottom only",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
      restrictions: {
        container: {
          allowLeavingFromTop: false,
          allowLeavingFromBottom: false,
          allowLeavingFromLeft: true,
          allowLeavingFromRight: true,
        },
      },
    },
    {
      id: "item-rest-container-all",
      item: "restricted all",
      style: { width: "16rem", height: "1rem", marginLeft: "32px" },
      restrictions: {
        container: {
          allowLeavingFromTop: false,
          allowLeavingFromBottom: false,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: false,
        },
      },
    },
  ];

  const parentID = "DFlex-some-container-restriction";

  return (
    <div className="root">
      <div className="todo">
        <ul id={parentID}>
          {items.map(({ id, style, item, restrictions }) => (
            <DFlexDnDComponent
              key={id}
              Component={"li"}
              registerInput={{ id }}
              style={style}
              opts={{
                restrictions,
                commit: {
                  enableAfterEndingDrag: false,
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

export default SomeRestrictedContainer;
