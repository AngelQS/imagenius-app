// Core
const path = require('path');

// Third
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');
const multer = require('multer');
const nunjucks = require('nunjucks');
const passport = require('passport');
require('dotenv').config();

// Local
const {
  APP_PORT,
  APP_ENVIRONMENT,
  IMAGENIUS_APP_MONGODB_DATABASE,
} = require('../config/env_vars.config');
const mappingApp = require('../routes/index.routes');

// Initializations
const PORT = APP_PORT || 3000;

const app = (app) => {
  // Settings
  app.set('port', PORT);
  app.set('environment', APP_ENVIRONMENT);
  app.set('views', path.join(__dirname, '../', 'views'));
  app.set('view engine', '.njk');
  nunjucks.configure(app.get('views'), {
    express: app,
  });

  // Middlewares
  app.use(cookieParser());
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
      name: 'sid', // change to env var SESSION_NAME
      rolling: false, // change to true
      resave: false,
      saveUninitialized: false,
      secret: 'secretEnvVar', // change to env var SESSION_SECRET
      cookie: {
        //maxAge: 60000, // change to env var SESSION_LIFETIME
        sameSite: true,
        secure: APP_ENVIRONMENT === 'production',
      },
      store: new MongoStore({
        secret: 'secretEnvVar',
        dbName: IMAGENIUS_APP_MONGODB_DATABASE,
        collection: 'sessions',
        mongooseConnection: mongoose.connection,
        ttl: 1 * 24 * 60 * 60, // 1 day. tll option overwrites cookie.maxAge
        //hash: true,
        //autoRemove: 'interval',
        //autoRemoveInterval: 1,
      }),
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
