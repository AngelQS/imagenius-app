// Third
const mongoose = require("mongoose");
const chalk = require("chalk");

// Local
const envVars = require("../config/env_vars.config");

// Initializations
const { IMAGENIUS_APP_MONGODB_DATABASE, IMAGENIUS_APP_MONGODB_HOST } = envVars;
const MONGODB_URI = `mongodb://${IMAGENIUS_APP_MONGODB_HOST}/${IMAGENIUS_APP_MONGODB_DATABASE}`;
const successMark = chalk.bold.yellow;
const errorMark = chalk.bold.red;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((db) =>
    console.log(
      successMark(`>>> Database ${IMAGENIUS_APP_MONGODB_DATABASE} is connected`)
    )
  )
  .catch((err) => console.log(errorMark(err)));
