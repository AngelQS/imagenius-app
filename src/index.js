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
 * @file index.js is the root file for this app
 * @name Imagenius App
 * @license MIT
 * @author Angel Quiroz Soriano
 * @version 1.0
 * @see <a href="https://github.com/backlabs">Backlabs Team</a>
 * @copyright Backlabs@2020
 */

app.listen(app.get("port"), () => {
  try {
    console.log(successMark(`>>> Server listen on port ${app.get("port")}`));
  } catch (err) {
    console.log(errorMark(`<< ${err}`));
  }
});
