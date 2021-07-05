<h1 align="center">
  <img
  src="https://raw.githubusercontent.com/jalal246/dflex/master/DFlex-readme.png"
  alt="Dflex logo" />
</h1>

<h1 align="center">Modern Draggable package for all JavaScript frameworks</h1>

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

# @dflex/draggable

DFlex Draggable is the simplest solution to create JavaScript draggable
elements. No need for a special tutorial and thinking about implementation
complexity or even migration to different technologies for different frameworks.
It can be used with any app you have whether it is React, Vue, Angular or
Svelte.

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
npm install @dflex/draggable
```

## Documentation 📖

Visit DFlex site for docs <https://www.dflex.dev/> and live demo.

## Related Content 🏋️‍

### [**Drag & Drop**](https://github.com/dflex-js/dflex/tree/master/packages/dnd)

A Drag-and-Drop package for all JavaScript frameworks implementing an enhanced
transformation mechanism to manipulate DOM elements. You can achieve a drag and
drop with three steps only with mouse/touch event.

### [**Utils/DOM Generator**](https://github.com/dflex-js/dflex/tree/master/packages/dom-gen)

DOM relations generator algorithm. Generate relations between DOM elements based
on element depth without a browser.

### [**Utils/DOM Store**](https://github.com/dflex-js/dflex/tree/master/packages/store)

The only Store that allows you to traverse through the DOM tree using element id
without reading from the browser.
