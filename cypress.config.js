const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: "cypress/reports/mocha",
    reportFilename: "[status]_[datetime]-[name]-report",
    quiet: true,
    html: false,
    json: true,
  },
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    blockHosts: [
      "*backtrace.io"
    ],
    failOnStatusCode: false,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
