// Third
const { Router } = require('express');

// Local
const indexCtrl = require('../controllers/index.ctrl');
const usersRouter = require('./users.routes');

// Initializations
const indexRouter = Router();

const mappingApp = (app) => {
  indexRouter.get('/', indexCtrl.renderIndex);

  // Route application
  app.use(indexRouter);
  app.use(usersRouter);
};

module.exports = mappingApp;
