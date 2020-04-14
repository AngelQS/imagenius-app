// Local
const {
  jwt: jwtUtils,
  sendgrid: makeMessage,
} = require('../config/index.config');
const { User } = require('../models/index.model');
const insertTokenToHTML = require('../components/email.component');

// Initializations
const usersCtrl = {};

usersCtrl.renderSignUpForm = (req, res) => {
  return res.render('users/signup');
};

usersCtrl.signUp = async (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.data is null
    if (!req.data) {
      req.flash('error', 'A problem has ocurred. Please try again later');
      return res.redirect('signup');
      //return reject(Error('Unable to get user input data from req.data'));
    }
    // Getting user data from req.data
    const data = req.data;
    // Handle error if data containts errors
    if (data.error) {
      console.log('DATA.ERROR');
      const dataError = data.error.details[0].message;
      req.flash('error', dataError);
      return res.redirect('signup');
      //return reject(new Error('Invalid user input data for sign up'));
    }

    // Checking if user already exists
    const username = data.value.username;
    const email = data.value.email;

    try {
      const user = await User.exists({
        $or: [{ username }, { email }],
      });
      if (user) {
        req.flash('error', 'Username or Email already in use');
        return res.redirect('signup');
      }
    } catch (err) {
      req.flash('Something went wrong. Please try again later');
    }

    // Save user to database
    await delete data.value.confirmationPassword;
    const newUser = await new User(data.value);
    // Generating user token
    const userData = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };
    const userToken = await jwtUtils.generate(userData);
    if (!userToken) {
      req.flash('error', 'Something went wrong. Please try again later');
      return res.redirect('signup');
      //return reject(Error('Unable to generate user token'));
    }

    // Saving the user
    await newUser.save((err) => {
      if (err) {
        req.flash('error', 'Something went wrong. Please try again later');
        return res.redirect('signup');
        //return reject(Error('Unable to save user to database'));
      }
      return resolve();
    });
  })
    .then(() => {
      // If none errors, redirect to signin view
      req.flash(
        'success',
        'Please, activate your account through verification code we send you',
      );
      res.redirect('signin');
      return next();
    })
    .catch((err) => {
      console.log('ERROR');
      // If errors exists, redirect to error view And log up the error
      req.error = err;
      return next(req.error);
    });
};

usersCtrl.renderSignInForm = (req, res) => {
  res.render('users/signin');
};

module.exports = usersCtrl;
