/**
 * @module Error Middleware
 * @category Modules
 * @subcategory Middlewares
 */

// Local
const chalk = require("chalk");
const { envVars } = require("../config/index.config");

// Initializations
/**
 * @namespace errorMiddleware
 * @property {method} error404 Manage HTTP 404 errors.
 * @property {method} errorHandler Manage production or development environment errors.
 */
const errorMiddlewares = {};

/** Application environment.
 * @type {string}
 */
const APP_ENV = envVars.APP_ENVIRONMENT;
const errorMark = chalk.bold.red;

/**
 * @description Manage HTTP 404 errors.
 * @method error404
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @returns {void} Renders error404 view.
 */
errorMiddlewares.error404 = (req, res) => {
  // Render 404 error view if page not found
  return res.render("errors/error404");
};

/**
 * @description Manage production or development environment errors.
 * @method errorHandler
 * @param {object} err Express Error object.
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @param {function} next Express Next middleware function.
 * @returns {void} Renders error500 view if the application environment is in production, otherwise prints the error.
 */
errorMiddlewares.errorHandler = (err, req, res, next) => {
  if (APP_ENV === "production") {
    // If app in production, render error view 500
    return res.render("errors/error500");
  }
  console.log("DEV ERROR");
  // Else, print the error
  const meta = `Error in ${req.method} ${req.url}`;
  console.log(errorMark(meta));
  console.log(errorMark(err));
  res.contentType("application/json");
  res.status(500).send("<p>Meta: ${meta}</p><p>Error: ${err}</p>");
};

module.exports = errorMiddlewares;
