---
id: contributing
title: Contributing To DFlex
---

This project and the idea of this project need your help that's why any
contribution is welcome. If you want to become a contributor to open source this
is the right place to start.

[The Open Source Guides website](https://opensource.guide/) has a collection of resources for individuals,
communities, and companies who want to learn how to run and contribute to an
open source project. Contributors and people new to open source alike will find
the following guide especially useful: [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)

## Get Involved

There are many ways to contribute to DFlex, and many of them do not involve writing any code. Here's a few ideas to get started:

> Start using DFlex!

Find the best package that you may find it interesting and use it. If you find
something not working, open an issue.

While reading, you might notice something missing from documentation. This is a
good start to participate by opening an issue.

Do you feel the project is cool and needs enhancements? You can start right now,
tell me what do you have in mind.

> You can fix typos, add new examples, or build with me new features.

Contributions are very welcome. If you think you need help planning your
contribution, please DM me and let me know you are looking for a bit of help.

## Development Process

### Installation

Make sure you have:

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

After cloning the repository:

- Run `yarn` in the repository's root directory to install everything you need
  for development.
- Run `yarn build` in the root directory to build the modules.

### Running Tests

You can use `yarn test` to run the tests in each package available in DFlex workspace.

Use yarn workspace followed by DFlex package name in package.json. So, If you deal with dflex/dnd for example you can use:

`yarn workspace @dflex/dnd add -D dotenv`

### License

By contributing to DFlex, you agree that your contributions will be
licensed under its GPL-3.0 License.
