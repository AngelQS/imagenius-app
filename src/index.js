// Third
const express = require('express');
const chalk = require('chalk');

// Local
const serverConfig = require('./server/server.config');
require('./database/database.config');

// Initialization
const app = serverConfig(express());
const successMark = chalk.bold.yellow;

app.listen(app.get('port'), () => {
  console.log(successMark(`>>> Server listen on port ${app.get('port')}`));
});
