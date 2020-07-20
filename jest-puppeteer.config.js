module.exports = {
  launch: {
    headless: false,
    slowMo: 250,
    timeout: 60000,
  },

  server: {
    command: `yarn workspace dflex-react-dnd run start `,
    launchTimeout: 1000000,
    port: 3001,
    debug: true,
  },
};
