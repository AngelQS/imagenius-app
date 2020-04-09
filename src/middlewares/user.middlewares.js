// Local
const { hapi_joi: userValidationSchema } = require('../config/index.config');

const usersMiddlewares = {};

usersMiddlewares.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'You must be registered first.');
    res.redirect('/');
  }
};

usersMiddlewares.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('error', 'You are already logged in.');
    res.redirect('/');
  } else {
    return next();
  }
};

usersMiddlewares.RegistryFormDataValidation = async (req, res, next) => {
  // Data input validation
  const validationResult = userValidationSchema
    .validateAsync(req.body)
    .then((data) => {
      req.data = validationResult;
      console.log('validationResult:', validationResult);
      next();
    })
    .catch((err) => next(err));
};

module.exports = usersMiddlewares;
