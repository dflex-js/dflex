import React from "react";
import cn from "classnames";

const TodoContainer = ({
  id,
  children,
  isCenterV = true,
  isCenterH = true,
}: {
  id: string;
  children: React.ReactNode;
  isCenterH?: boolean;
  isCenterV?: boolean;
}) => {
  const containerClasses = cn("flex", "min-h-screen", "p-6", {
    "justify-center": isCenterV,
    "items-center": isCenterH,
  });

  return (
    <div className={containerClasses}>
      <ul className="bg-green-50 border-2 border-blue-50 rounded p-4" id={id}>
        {children}
      </ul>
    </div>
  );
};

export default TodoContainer;
