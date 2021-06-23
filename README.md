<h1 align="center">
  <img
  src="https://raw.githubusercontent.com/jalal246/dflex/update_docs/dflex-github-cover.png"
  alt="Dflex logo" />
</h1>

<p align="center">
  <a href="https://github.com/dflex-js/dflex">
    <img
    src="https://img.shields.io/github/workflow/status/jalal246/dflex/Unit Test"
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

### [**DOM Generator**](https://github.com/dflex-js/dflex/tree/master/packages/dom-gen)

DOM relations generator algorithm. Generate relations between DOM elements based
on element depth without a browser.

### [**DOM Store**](https://github.com/dflex-js/dflex/tree/master/packages/store)

The only Store that allows you to traverse through the DOM tree using element id
without reading from the browser.

### [**Drag & Drop**](https://github.com/dflex-js/dflex/tree/master/packages/dnd)

A Simple, lightweight Solution for a Drag & Drop App based on enhanced DOM store
algorithm. You can achieve a drag and drop with three steps only with mouse event.

### [**Draggable**](https://github.com/dflex-js/dflex/tree/master/packages/draggable)

High-performance draggable elements written in pure JS works for Web and Mobile.

## Documentation

Visit DFlex site for more <https://dflex.dev>

## Installation

Packages are decoupled and work separately. Each package has it own universe
including test and playground. For more info take a look at [contribution guide](CONTRIBUTING.md).

## License

DFlex is open source and dual-licensed as [AGPL](LICENSE)/Commercial software.

DFlex is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

Buying a license is mandatory if you develop commercial activities using
DFlex inside your product or deploying it on a network without disclosing the
source code of your own applications under the AGPL license.

## Contribution

Like many open-source projects, DFlex requires that contributors should provide a
Contributor License Agreement (CLA). By submitting code to the DFlex project,
you are granting the author the right to use that code under the terms of the CLA.

This project uses Microsoft Contributor License Agreement which is available to
the public domain under Creative Commons CC0 1.0 Universal.

If you like this project, you can support it by contributing. If you find a bug,
please let me know, applying a pull request is welcome. This project needs your
support. You can fix typos, add new examples, or build with me new features.
