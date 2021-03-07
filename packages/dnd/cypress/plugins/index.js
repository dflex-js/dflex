/* eslint-disable tsdoc/syntax */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // eslint-disable-next-line global-require
  require("@cypress/code-coverage/task")(on, config);

  // add other tasks to be registered here

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
};
