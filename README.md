<h1 align="center">
  <a href="https://www.dflex.dev/" target="_blank">
    <img
    src="https://raw.githubusercontent.com/jalal246/dflex/master/DFlex-readme.png"
    alt="Dflex logo" />
  </a>
</h1>

<h1 align="center">JavaScript Project to Manipulate DOM Elements</h1>

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

A Drag-and-Drop library for all JavaScript frameworks implementing an enhanced
transformation mechanism to manipulate DOM elements.

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

## Project Content 🔥

### [**Drag & Drop**](https://github.com/dflex-js/dflex/tree/master/packages/dnd)

A Simple, lightweight Solution for a Drag & Drop App based on enhanced DOM store
algorithm. You can achieve a drag and drop with three steps only with
mouse/touch event.

### [**Draggable**](https://github.com/dflex-js/dflex/tree/master/packages/draggable)

High-performance draggable elements written in pure JS works for Web and Mobile.

### [**Utils/DOM Generator**](https://github.com/dflex-js/dflex/tree/master/packages/dom-gen)

DOM relations generator algorithm. Generate relations between DOM elements based
on element depth without a browser.

[**@dflex/store**](https://github.com/dflex-js/dflex/tree/master/packages/store):
DFex Store has main registry for all DOM elements that will be manipulated. It
is a singleton object that is accessible from anywhere in the application. The
initial release was generic but it only has the Core of the library since ^V3.

## Documentation 📖

Visit DFlex site for more <https://www.dflex.dev/>

## Installation 📦

DFlex contains multiple packages that shapes the final product. All Packages are
decoupled and work separately. Each package has it own universe including test
and playground or at lease this is the initial plan.

DFlex is written entirely in plain JavaScript/TypeScript and doesn't depend on
any specific framework. However, it's using the
[**React**](https://reactjs.org/) for playground and
[**Cypress**](https://www.cypress.io/) for end to end testing. It's also
using [**Jest**](https://jestjs.io/) for unit testing and
[**Lerna**](https://lerna.js.org/) to manage the packages.

Clone the repository

```bash
git clone https://github.com/dflex-js/dflex.git
cd dflex
yarn install
```

This will clone and install all development dependencies. If you are using
windows you probably have to install cypress manually as following:

```bash
yarn cy:install:win
```

To start development you can use the following command:

```bash
yarn workspace @dflex/dnd dev
```

This will run the development playground for the DnD package. Open the browser
[http://localhost:3001](http://localhost:3001) to see the playground. You can
check the code in the
[**packages/dnd/playgrounds**](https://github.com/dflex-js/dflex/blob/dev/update_main_page/packages/dnd/playgrounds/dflex-react-dnd/src/App.tsx)
to see the available routing.

If you want to change the codebase and live edit the playground you have to
compile while running the playground. You can use the following command:

```bash
yarn workspace @dflex/dnd compile:w && yarn workspace @dflex/dnd dev

```

After finish editing you can make sure the changes you make are not going to
break the code. You can do that by running the test and have some fun watching
Cypress do the job:

```bash
yarn workspace @dflex/dnd dev:cy:extended
```

## Contribution 🌎

PRs are welcome, please make sure to read the
[**Contributing guide**](/CONTRIBUTING.md) before submitting a PR.

To submit a PR:

1- [Fork DFlex](https://github.com/dflex-js/dflex/fork) then clone the
repository.

2- Create a new branch: `git checkout -b my-branch-name`.

3- Make your change.

4- Push to your fork and submit a pull request when ready.

## License 🤝

DFlex is [MIT License](LICENSE) since version 3.0.0 and above.
