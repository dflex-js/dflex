module.exports = {
  launch: {
    headless: process.env.CI === "true",
  },
  browserContext: process.env.INCOGNITO ? "incognito" : "default",
  server: [
    {
      command: `yarn workspace dflex-react-dnd run start `,
      debug: true,
    },
    {
      command: `yarn workspace dflex-react-draggable run start `,
      debug: true,
    },
  ],
};
