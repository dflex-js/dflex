<h1 align="center">
  <a href="https://www.dflex.dev/" target="_blank">
    <img
    src="https://raw.githubusercontent.com/jalal246/dflex/master/DFlex-readme.png"
    alt="Dflex logo" />
  </a>
</h1>

<h1 align="center">DFlex Interactive Drag and Drop Element(s)</h1>

<p align="center">
  <a href="https://github.com/dflex-js/dflex">
    <img
    src="https://img.shields.io/github/workflow/status/dflex-js/dflex/Unit Test"
    alt="Dflex build status" />
  </a>
  <a href="https://github.com/dflex-js/dflex/pulls">
    <img
    src="https://img.shields.io/github/issues-pr/dflex-js/dflex"
    alt="number of opened pull requests"/>
  </a>
  <a href="https://github.com/dflex-js/dflex/issues">
  <img
    src="https://img.shields.io/github/issues/dflex-js/dflex"
    alt="number of opened issues"/>
  </a>
  <a href="https://github.com/dflex-js/dflex/pulls">
   <img
   src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"
   alt="Dflex welcomes pull request" />
  </a>
</p>

# DFlex

A Drag-and-Drop library for all JavaScript frameworks implementing an enhanced
transformation mechanism to manipulate DOM elements. It is so far the only
library on internet that manipulates the DOM instead of reconstructing it.

## Features ✅

- Dynamic architecture.
- Traverse DOM without calling browser API.
- Transform elements instead of reordering the DOM tree.
- Animated movement from point-x to point-y.
- Prevent drag and drop layout shift.
- Isolated from data flow.
- Headless as it is just functions that do manipulation.
- Event driven API.
- Targeting each DOM node individually.
- Extensible using JSON tree instead of flat recursion.
- Support three different types of restrictions:<br/>
  1 -Restricted area related to the parent container.<br/>
  2- Restricted area related to the viewport.<br/>
  3- Restricted area related to the position itself.
- Support four types of custom events with custom layout state emitter.
- Auto remove selection when starting dragging.

## Implemented Transformation 💡

- The original input order which appears when inspecting elements stays the
  same. While the visual order happens after transformation and it's supported by the
  `data-index` attribute to know the order of elements in the visual list.<br/><br/>
  ![original and visual order](https://user-images.githubusercontent.com/19228730/126757232-0e72a153-7fba-4868-b881-d29f2439d510.gif)

- To enable handling a large set of elements, the transformation is related
  to the viewport. No matter how many elements are affected, DFlex only
  transforms elements visible on the screen. Elements outside the viewport are
  triggered to a new position when they are visible.<br/><br/>
  ![Trigger elements visible on the screen](https://user-images.githubusercontent.com/19228730/126758576-e716787d-3ff7-44cb-883a-c6b7064e30e5.gif)

- Support strict transformation between containers.<br/><br/>
  ![Handle orphaned container](https://user-images.githubusercontent.com/19228730/165508982-c4d3b317-19bd-4a98-ba0f-febf772de44a.gif)

## Installation 📦

```bash
npm install @dflex/dnd
```

## Documentation 📖

Visit DFlex site for docs <https://www.dflex.dev/> and live demo.

## Related Content 🏋️‍

### [**@dflex/dom-gen**](https://github.com/dflex-js/dflex/tree/master/packages/dom-gen)

DFlex DOM relations generator algorithm. It Generates relations between DOM elements based
on element depth so all the registered DOM can be called inside registry without
the need to call browser API. Read once, implement everywhere.

### [**@dflex/core-instance**](https://github.com/dflex-js/dflex/tree/master/packages/core-instance)

Core instance is the mirror of interactive element that includes all the properties and methods to manipulate the node.

### [**@dflex/utils**](https://github.com/dflex-js/dflex/tree/master/packages/utils)

A collection of shared functions. Mostly classes, and types that are used across
the project.

### [**@dflex/store**](https://github.com/dflex-js/dflex/tree/master/packages/store)

DFex Store has main registry for all DOM elements that will be manipulated. It
is a singleton object that is accessible from anywhere in the application. The
initial release was generic but it only has the Core of the library since ^V3.

### [**@dflex/draggable**](https://github.com/dflex-js/dflex/tree/master/packages/draggable)

Light weight draggable element without extra functionalities that is
responsible for interacting with the DOM and moving the affected element(s).

## License 🤝

DFlex is [MIT License](LICENSE) since version 3.0.0 and above.
