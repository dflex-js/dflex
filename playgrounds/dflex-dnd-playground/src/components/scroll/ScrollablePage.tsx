import React from "react";

import DFlexDnDComponent from "../DFlexDnDComponent";

/**
 *  A non-scrollable list with overflown page.
 * @returns
 */
const ScrollablePage = () => {
  return (
    <div className="root">
      <div className="todo">
        <ul style={{ marginTop: "400px", marginBottom: "200px" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <DFlexDnDComponent
              Component={"li"}
              registerInput={{ id: `id_${i}` }}
              key={`${i}`}
              opts={{
                commit: {
                  enableAfterEndingDrag: false,
                },
              }}
            >
              {`${i}`}
            </DFlexDnDComponent>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScrollablePage;
