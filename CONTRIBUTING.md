# Prerequisites

- [Node.js](https://nodejs.org/en/) >= v16 must be installed.
- [PNPM](https://pnpm.io/)

## Installation

- Run `pnpm install` in the repository's root directory to install everything you need
  for development.
- Run `pnpm build` in the root directory to build the modules.

## Development

DFlex contains multiple packages that shapes the final product. All Packages are
decoupled and work separately. Each package has it own universe including test
and playground or at lease this is the initial plan.

DFlex is written entirely in plain
JavaScript/[**TypeScript**](https://www.typescriptlang.org/) and doesn't depend
on any specific framework. However, it's using the
[**React**](https://reactjs.org/) for playground,
[**Cypress**](https://www.cypress.io/) and
[**Playwright**](https://playwright.dev/) for end to end testing. It's also
using [**Jest**](https://jestjs.io/) for unit testing and
[**PNPM**](https://pnpm.io/) to manage the packages.

Clone the repository

```bash
git clone https://github.com/dflex-js/dflex.git
cd dflex
pnpm install
```

To start development you can use the following command:

```bash
pnpm start
```

This will run the development playground for the DnD package. Open the browser
[http://localhost:3001](http://localhost:3001) to see the playground. You can
check the code in the
[**packages/dnd/playgrounds**](https://github.com/dflex-js/dflex/tree/main/packages/dflex-dnd-playground)
to see the available components and implementation.

## Submitting a PR

1- [Fork DFlex](https://github.com/dflex-js/dflex/fork) then clone the
repository.

2- Create a new branch: `git checkout -b my-branch-name`.

3- Make your change.

4- Push to your fork and submit a pull request when ready.

## Before submitting PR

1. Check types `pnpm check-types`
2. Check unit test `pnpm jest`
3. Check linter `pnpm lint`
4. Run playground `pnpm start` then: <br />
   a. Check smoke test `pnpm playwright test`<br />
   b. Check essential mechanism `pnpm cy:run:vertical:chrome` <br />
   c. Check migrating between containers `pnpm cy:run:vertical:chrome`
