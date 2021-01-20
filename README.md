<h1 align="center">
  <img
  src="https://raw.githubusercontent.com/jalal246/dflex/master/DFlex-full-size.png"
  alt="Dflex logo" />
</h1>

<p align="center">
  <a href="https://github.com/jalal246/dflex">
    <img
    src="https://img.shields.io/github/workflow/status/jalal246/dflex/Unit Test"
    alt="Dflex build status" />
  </a>
  <a href="https://github.com/jalal246/dflex/pulls">
    <img
    src="https://img.shields.io/github/issues-pr/jalal246/dflex" 
    alt="number of opened pull requests"/>
  </a>
  <a href="https://github.com/jalal246/dflex/issues">
  <img
    src="https://img.shields.io/github/issues/jalal246/dflex"
    alt="number of opened issues"/>
  </a>
  <a href="https://github.com/jalal246/dflex/pulls">
   <img
   src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"
   alt="Dflex welcomes pull request" />
  </a>
</p>

# DFlex

> JavaScript Project to Manipulate DOM Elements

DFlex is a JavaScript solution. It is not a solution for a specific
framework. A pure JavaScript library. Every fix, feature, or enhancement
will affect all framework implementations.

It is a solution to native-like browser API focused on performance and easy
implementation.

Dflex contains a collection of utility packages for DOM. Focused on
performance and extensibility. All packages are decoupled. Work
separately to prevent a bloated bundle in production and to make it
easier to maintain.

DFlex is also extensible. In most existing solutions the more elements
you are trying to manipulate the more lagging you get. With DFlex, no
matter how many elements you are dealing with it’s always going to be
smooth manipulation.

It has parent/children architecture. So you can manipulate a child or parent.
Entries are not an array, and not necessary to be in order. Works with async
rendering from parents to children or vice versa because it has a flexible
design.

Every node manipulation is calculated and exposed. So you can add your
own functionality without starting from scratch.

## Project Content

Inside each package, there's a description and full documentation.

### [**DOM Generator**](https://github.com/jalal246/dflex/tree/master/packages/dom-gen)

DOM relations generator algorithm. Generate relations between DOM elements based
on element depth without a browser.

### [**DOM Store**](https://github.com/jalal246/dflex/tree/master/packages/store)

The only Store that allows you to traverse through the DOM tree using element id
without reading from the browser.

### [**Drag & Drop**](https://github.com/jalal246/dflex/tree/master/packages/dnd)

A Simple, lightweight Solution for a Drag & Drop App based on enhanced DOM store
algorithm. You can achieve a drag and drop with three steps only with mouse event.

### [**Draggable**](https://github.com/jalal246/dflex/tree/master/packages/draggable)

High-performance draggable elements written in pure JS works for Web and Mobile.

## Documentation

Visit DFlex site for more https://jalal246.github.io/dflex/

## Installation

Packages are decoupled and work separately. Each package has it own universe
including test and playground. For more info take a look at [contribution guide](CONTRIBUTING.md).

## Contribution

If you like this project, you can support it by contributing. If you find a bug,
please let me know, applying a pull request is welcome. This project needs your
support. You can fix typos, add new examples, or build with me new features.

> Support this project by giving it a Star ⭐
