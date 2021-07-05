<h1 align="center">
  <img
  src="https://raw.githubusercontent.com/jalal246/dflex/master/DFlex-readme.png"
  alt="Dflex logo" />
</h1>

<h1 align="center">DOM relations generator algorithm</h1>

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

# @dflex/dom-gen

Dom generator generates relations between DOM elements based on element depth
without a browser.

It generates three keys: Siblings, Parent and Children keys and two indexes one
refers to node order in its level and the other refers to the parent index in
parental level.

Together: keys and indexes combined form of uniqueness for each element.

## Installation 📦

```bash
npm install @dflex/dom-gen
```

## Documentation 📖

Visit DFlex site for docs <https://www.dflex.dev/> and live demo.

## Related Content 🏋️‍

### [**Drag & Drop**](https://github.com/dflex-js/dflex/tree/master/packages/dnd)

A Drag-and-Drop package for all JavaScript frameworks implementing an enhanced
transformation mechanism to manipulate DOM elements. You can achieve a drag and
drop with three steps only with mouse/touch event.

### [**Draggable**](https://github.com/dflex-js/dflex/tree/master/packages/dnd)

DFlex Draggable is the simplest solution to create JavaScript draggable only elements.

### [**Utils/DOM Store**](https://github.com/dflex-js/dflex/tree/master/packages/store)

The only Store that allows you to traverse through the DOM tree using element id
without reading from the browser.
