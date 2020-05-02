/**
 * @module Index Routes
 * @category Modules
 * @subcategory Routes
 */

// Third
const { Router } = require("express");

// Local
const indexCtrl = require("../controllers/index.ctrl");
const usersRouter = require("./users.routes");

// Initializations
const indexRouter = Router();

/**
 * @description Mapping the express server.
 * @function mappingApp
 * @param {object} app Express instance.
 */
const mappingApp = (app) => {
  /**
   * @description Gets the index view.
   * @name Get Index
   * @path {GET} /
   */
  indexRouter.get("/", indexCtrl.renderIndex);

  // Route application
  app.use(indexRouter);
  app.use(usersRouter);
};

module.exports = mappingApp;
