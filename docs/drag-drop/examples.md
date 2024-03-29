---
title: Drag and Drop Examples
description: "DFlex drag and drop component example built with React"
---

### Three principles

In all DFlex examples it's important to focus on three principles:

- `register`/`unregister` component in the store.
- Create dag and drop instance.
- Call `dragAt`/`endDragging` when needed.

### Building DnD Component

```tsx
import { store, DnD } from "@dflex/dnd";
import type { DFlexDnDOpts, DFlexEvents } from "@dflex/dnd";

let dflexDnD: DnD | null;

interface Props {
  Component: string | React.JSXElementConstructor<any>;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  registerInput: {
    id: string;
    depth?: number;
    readonly?: boolean;
  };
  opts?: DFlexDnDOpts;
}

const DFlexDnDComponent = ({
  Component,
  registerInput,
  style,
  className,
  children,
  opts,
}: Props) => {
  const dndCompRef = React.useRef() as React.MutableRefObject<HTMLLIElement>;

  const { id, depth, readonly } = registerInput;

  React.useEffect(() => {
    if (dndCompRef.current) {
      store.register({ id, depth, readonly });
    }

    return () => {
      store.unregister(id);
    };
  }, [dndCompRef.current]);

  const onDFlexEvent = (e: DFlexEvents) => {
    // eslint-disable-next-line no-console
    console.log(`onDFlexEvent: ${e.type}`, e.detail);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dflexDnD) {
      const { clientX, clientY } = e;

      dflexDnD.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (dflexDnD) {
      dflexDnD.endDragging();

      dflexDnD = null;

      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);

      document.removeEventListener("$onDragLeave", onDFlexEvent);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const { button, clientX, clientY } = e;

    // Avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);
        dflexDnD = new DnD(id, { x: clientX, y: clientY }, opts);

        document.addEventListener("$onDragLeave", onDFlexEvent);
      }
    }
  };

  return (
    <Component
      ref={dndCompRef}
      id={id}
      onMouseDown={onMouseDown}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};
```

### Subscribe to layout

```tsx
import { store } from "@dflex/dnd";

const App = () => {
  React.useEffect(() => {
    const unsubscribe = store.listeners.subscribe((e) => {
      console.info("new layout state", e);
    }, "layoutState");

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = store.listeners.subscribe((e) => {
      console.info("new mutation state", e);
    }, "mutation");

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    return () => {
      store.destroy();
    };
  }, []);

  return <MYDnDComponents />;
};
```

### Key points

> DOM elements are not re-ordered

Reordering the element on each movement will eventually lead to performance disaster. Increase scripting and painting time. Waste all the enhancements you've made on your application.

Instead, simple calculations are made directly to animate each element with `translate(x,y)`.

The new coordinates are stored in the store, so each time the user decides to manipulate the layout DFlex already knows the coordinates without communicating with the browser. Another win for your application performance.

> Continuity

One of the most important concepts in DFlex is to preserve the layout state.
And this is guaranteed temporarily and permanently by keeping track of each
change in the layout and make sure it can be restored automatically in case DOM
node is updated outside DFlex territory.

> Minimal side effect

Because DFlex operates on each DOM node individually it doesn't affect far siblings. Let's suppose you switch first element with the second in a container list contains 100 elements. In mot solutions all the siblings will be notified and manipulated even if they are not effected. With DFlex this is not the case, If you switch A with B then only A and B will be affected and manipulated.
