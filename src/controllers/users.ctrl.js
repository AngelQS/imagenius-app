// Local
const userValidationSchema = require('../config/hapi_joi.config');
const { User } = require('../models/index.model');

// Initializations
const usersCtrl = {};

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('signup');
};

usersCtrl.signUp = async (req, res, next) => {
  try {
    // Data input verification
    const result = userValidationSchema.validate(req.body);

    // Data input validation
    if (result.error) {
      req.flash('error', result.error.details[0].message);
      console.log('req.body:', req.body);
      console.log('validation error:', result.error.details[0].message);
      res.send('Error on validation!');
    }

    // Checking if email is already taken
    const users = await User.find({
      $or: [{ email: result.value.email }, { username: result.value.username }],
    });
    users.forEach(async (user) => {
      if (user.email == result.value.email) {
        req.flash('error', 'Email is already in use.');
      }
      if (user.username == result.value.username) {
        req.flash('error', 'Username is already in use.');
        req.redirect('/users/signup');
      }
    });
    console.log('Successfull signup!');
  } catch (err) {
    next(err);
  }
};

module.exports = usersCtrl;
