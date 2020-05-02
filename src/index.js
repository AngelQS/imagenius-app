// Third
const express = require("express");
const chalk = require("chalk");

// Local
const serverConfig = require("./server/server.config");
require("./database/database.config");

// Initialization
const app = serverConfig(express());
const successMark = chalk.bold.yellow;
const errorMark = chalk.bold.red;

/**
 * @file An App for sharing fantastic images.
 * @name Imagenius App
 * @license {@link https://opensource.org/licenses/MIT|MIT}
 * @author {@link https://github.com/AngelQS|AngelQS}
 * @version 0.0.3
 * @see {@link https://github.com/backlabs|Backlabs Team}
 * @copyright @ 2020 Backlabs
 */

app.listen(app.get("port"), () => {
  try {
    console.log(successMark(`>>> Server listen on port ${app.get("port")}`));
  } catch (err) {
    console.log(errorMark(`<< ${err}`));
  }
});
