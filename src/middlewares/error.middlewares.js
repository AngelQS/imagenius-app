// Local
const chalk = require('chalk');
const { envVars } = require('../config/index.config');

// Initializations
const APP_ENV = envVars.APP_ENVIRONMENT;
const errorMark = chalk.bold.red;

const errorMiddlewares = {};

errorMiddlewares.error404 = (req, res) => {
  // Render 404 error view if page not found
  return res.render('errors/error404');
};

errorMiddlewares.errorHandler = (err, req, res, next) => {
  if (APP_ENV === 'production') {
    // If app in production, render error view 500
    return res.render('errors/error500');
  }
  console.log('DEV ERROR');
  // Else, print the error
  const meta = `Error in ${req.method} ${req.url}`;
  console.log(errorMark(meta));
  console.log(errorMark(err));
  res.contentType('application/json');
  res.status(500).send('<p>Meta: ${meta}</p><p>Error: ${err}</p>');
};

module.exports = errorMiddlewares;
