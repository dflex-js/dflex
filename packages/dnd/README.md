<h1 align="center">
  <a href="https://www.dflex.dev/" target="_blank">
    <img
    src="https://raw.githubusercontent.com/jalal246/dflex/master/DFlex-readme.png"
    alt="Dflex logo" />
  </a>
</h1>

<h1 align="center">Modern drag and drop package for all JavaScript frameworks</h1>

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

# @dflex/dnd

DFlex Drag and Drop is a modern drag and drop package for all JavaScript
frameworks written in pure JavaScript and can be used with different frameworks
whether it is React, Vue, Angular, etc.

It depends on animation, tracks each droppable area which makes the whole
process runs smoothly as much as possible.

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
npm install @dflex/dnd
```

## Documentation 📖

Visit DFlex site for docs <https://www.dflex.dev/> and live demo.

## Related Content 🏋️‍

### [**Draggable**](https://github.com/dflex-js/dflex/tree/master/packages/dnd)

DFlex Draggable is the simplest solution to create JavaScript draggable only elements.

### [**Utils/DOM Generator**](https://github.com/dflex-js/dflex/tree/master/packages/dom-gen)

DOM relations generator algorithm. Generate relations between DOM elements based
on element depth without a browser.

### [**Utils/DOM Store**](https://github.com/dflex-js/dflex/tree/master/packages/store)

The only Store that allows you to traverse through the DOM tree using element id
without reading from the browser.
