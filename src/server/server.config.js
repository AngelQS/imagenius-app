// Core
const path = require('path');

// Third
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
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
  IMAGENIUS_APP_MONGODB_DATABASE: database,
  IMAGENIUS_APP_SESSION_SECRET: secretKey,
} = require('../config/env_vars.config');
const { error404, errorHandler } = require('../middlewares/error.middlewares');
const mappingApp = require('../routes/index.routes');

// Initializations
const PORT = APP_PORT || 3000;
const secret = secretKey || 'secretSession';

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
      secret: secret,
      cookie: {
        //maxAge: 60000, // change to env var SESSION_LIFETIME
        sameSite: true,
        secure: APP_ENVIRONMENT === 'production',
        httpOnly: true,
      },
      store: new MongoStore({
        secret: 'secretEnvVar',
        dbName: database,
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

  // Routes
  mappingApp(app);

  // 404 error handler
  app.get('*', error404);
  // 500 error handler
  app.use(errorHandler);

  return app;
};

module.exports = app;
