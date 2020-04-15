// Local
const { hapi_joi: userValidationSchema } = require('../config/index.config');

const userMiddlewares = {};

userMiddlewares.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'You must be registered first.');
    res.redirect('/');
  }
};

userMiddlewares.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('error', 'You are already logged in.');
    res.redirect('/');
  } else {
    return next();
  }
};

userMiddlewares.inputDataValidation = async (req, res, next) => {
  new Promise((resolve, reject) => {
    // Input data validation
    const result = userValidationSchema.validate(req.body);
    if (!result) {
      return reject(Error('Unable to validate user input data'));
    }

    // Resolving promise if not null
    return resolve(result);
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

userMiddlewares.inputDataErrorHandler = async (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.data is null
    if (!req.data) {
      req.flash('error', 'Something went wrong. Please try again later');
      return res.redirect('signup');
    }
    // Getting user data from req.data
    const data = req.data;
    // Handle error if data containts errors
    if (data.error) {
      const dataError = data.error.details[0].message;
      req.flash('error', dataError);
      return res.redirect('signup');
    }

    // Resolving promise if it has no errors
    return resolve();
  })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = userMiddlewares;
