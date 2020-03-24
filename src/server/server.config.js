// Core
const path = require('path');

// Third
const flash = require('connect-flash');
const errorHandler = require('errorhandler');
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const morgan = require('morgan');
const multer = require('multer');
const nunjucks = require('nunjucks');
const passport = require('passport');
require('dotenv').config();

// Local
const envVars = require('../config/env_vars.config');
const mappingApp = require('../routes/index.routes');

const app = (app) => {
  // Settings
  app.set('port', envVars.APP_PORT || 3000);
  app.set('environment', envVars.APP_ENVIRONMENT);
  app.set('views', path.join(__dirname, '../', 'views'));
  app.set('view engine', '.njk');
  nunjucks.configure(app.get('views'), {
    express: app,
  });

  // Middlewares
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(
    multer({
      dest: path.join(__dirname, '../', 'public/upload/temp'),
    }).single('image'),
  );
  app.use(methodOverride('_method'));
  app.use(flash());
  app.use(
    session({
      cookie: { maxAge: 60000 },
      secret: '3170',
      resave: true,
      saveUninitialized: true,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Global variables
  app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    //res.locals.user = req.user || null;
    next();
  });

  // Static files
  app.set('static files', path.join(__dirname, '../', 'public'));
  app.use(express.static(app.get('static files')));

  // Error handlers
  if (app.get('environment' === 'development')) {
    app.use(errorHandler());
  }

  // Routes
  mappingApp(app);

  return app;
};

module.exports = app;
