<h1 align="center">
  <a href="https://www.dflex.dev/" target="_blank">
    <img
    src="https://raw.githubusercontent.com/jalal246/dflex/master/DFlex-readme.png"
    alt="Dflex logo" />
  </a>
</h1>

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

# @dflex/core-instance

Core instance is the mirror of the DOM element. It is the core of every
interactive element. Has all the properties and methods to manipulate the DOM
element.

## DFlex Features ✅

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

## Installation 📦

```bash
npm install @dflex/core-instance
```

## Documentation 📖

Visit DFlex site for docs <https://www.dflex.dev/> and live demo.

## Related Content 🏋️‍

### [**@dflex/dom-gen**](https://github.com/dflex-js/dflex/tree/master/packages/dom-gen)

DFlex DOM relations generator algorithm. It Generates relations between DOM elements based
on element depth so all the registered DOM can be called inside registry without
the need to call browser API. Read once, implement everywhere.

### [**@dflex/utils**](https://github.com/dflex-js/dflex/tree/master/packages/utils)

A collection of shared functions. Mostly classes, and types that are used across
the project.

### [**@dflex/store**](https://github.com/dflex-js/dflex/tree/master/packages/store)

DFex Store has main registry for all DOM elements that will be manipulated. It
is a singleton object that is accessible from anywhere in the application. The
initial release was generic but it only has the Core of the library since ^V3.

### [**@dflex/draggable**](https://github.com/dflex-js/dflex/tree/master/packages/draggable)

Light weight draggable component without extra functionalities that is
responsible for interacting with the DOM and moving the affected element(s).

### [**@dflex/dnd**](https://github.com/dflex-js/dflex/tree/master/packages/dnd)

The main package that depends on the other packages. It is responsible for the
magical logic of the library to introduce the drag and drop interactive
functionality.

## License 🤝

DFlex is [MIT License](LICENSE) since version 3.0.0 and above.
