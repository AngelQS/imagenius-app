// Local
const userValidationSchema = require('../config/hapi_joi.config');
const { User } = require('../models/index.model');

// Initializations
const usersCtrl = {};

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('signup');
};

usersCtrl.signUp = async (req, res, next) => {
  console.log('into signUp');
  try {
    // Data input verification
    const result = userValidationSchema.validate(req.body);

    // Data input validation
    if (result.error) {
      req.flash('error', result.error.details[0].message);
      console.log('validation error:', result.error.details[0].message);
      res.redirect('/users/signup');
    }
    //console.log('req.body:', req.body);

    // Checking if email and username is already taken
    const users = await User.find({
      $or: [{ email: result.value.email }, { username: result.value.username }],
    });
    users.forEach(async (user) => {
      if (user.email == result.value.email) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/users/signup');
      }
      if (user.username == result.value.username) {
        req.flash('error', 'Username is already in use.');
        req.redirect('/users/signup');
      }
    });

    // Save user to database
    await delete result.value.confirmationPassword;
    const newUser = await new User(result.value);
    newUser.password = await newUser.encryptPassword(result.value.password);
    console.log(newUser);

    // Generate secret token
  } catch (err) {
    next(err);
  }
};

module.exports = usersCtrl;
