// Third
const userValidationSchema = require('../config/hapi_joi.config');

// Initializations
const usersCtrl = {};

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('signup');
};

usersCtrl.signUp = (req, res, next) => {
  try {
    const result = userValidationSchema.validate(req.body);
    if (result.error) {
      req.flash('error', result.error.details[0].message);
      console.log('req.body:', req.body);
      console.log('validation error:', result.error.details[0].message);
      res.send('Error on validation!');
    } else {
      res.send('Successfull validation!');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = usersCtrl;
