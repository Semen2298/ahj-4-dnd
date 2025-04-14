const path = require("path");

module.exports = {
  testTimeout: 10000,
  preset: "jest-puppeteer",
  moduleNameMapper: {
    "\\.(svg|png|jpg|jpeg)$": path.join(
      __dirname,
      "src/js/__mocks__/fileMock.js",
    ),
  },
};
