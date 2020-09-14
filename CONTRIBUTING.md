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

## Documentation

- Run above installation steps and then
- Run `yarn workspace @dflex/site develop` to run a development server of gatsby.
- Run `yarn workspace @dflex/site site` to create a build of the assets for the
  documentation website.
