# Prerequisites

- [Node.js](https://nodejs.org/en/) >= v10 must be installed.
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

## Installation

- Run `yarn` in the repository's root directory to install everything you need
  for development.
- Run `yarn build` in the root directory to build the modules.

## Running Tests

- `yarn test` to run the tests in each package available in workspace.

## Dealing with packages

- Use `yarn workspace` followed by DFlex package name in `package.json`.
  So, If you deal with `dflex/dnd` for example you can use:

  `yarn workspace @dflex/dnd add -D dotenv`

## Development

DFlex contains multiple packages that shapes the final product. All Packages are
decoupled and work separately. Each package has it own universe including test
and playground or at lease this is the initial plan.

DFlex is written entirely in plain JavaScript/TypeScript and doesn't depend on
any specific framework. However, it's using the
[**React**](https://reactjs.org/) for playground and
[**Cypress**](https://www.cypress.io/) for end to end testing. It's also using
[**Jest**](https://jestjs.io/) for unit testing and
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
