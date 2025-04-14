module.exports = {
  launch: {
    headless: "new",
    slowMo: 50,
  },
  server: {
    command: "yarn show:dist",
    port: 8080,
    launchTimeout: 30000,
    debug: true,
  },
};
