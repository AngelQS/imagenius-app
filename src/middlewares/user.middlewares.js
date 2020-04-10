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

usersMiddlewares.registryDataValidation = async (req, res, next) => {
  new Promise((resolve, reject) => {
    // Input data validation
    let result = userValidationSchema.validate(req.body);

    if (!result) {
      reject(Error('Unable to validate user input data'));
    }

    // Resolving promise if not null
    resolve(result);
  })
    .then((result) => {
      // Saving the validation result
      req.data = result;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = usersMiddlewares;
