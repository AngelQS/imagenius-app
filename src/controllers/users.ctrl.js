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
  res.render('signup');
};

usersCtrl.signUp = async (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.data is null
    if (!req.data) {
      req.flash('error', 'A problem has ocurred. Please try again later');
      reject(Error('Unable to get user input data from req.data'));
    }

    // Getting user data from req.data
    const data = req.data;

    // Handle error if data containts errors
    if (data.error) {
      const err = data.error.details[0].message;
      req.flash('error', err);
      reject(Error('Invalid user input data for sign up'));
    }

    const username = data.value.username;
    const email = data.value.email;

    const user = await User.exists(
      { $or: [{ username }, { email }] },
      (err) => {
        if (err) {
          reject(Error('Unable to find users on Users Model'));
        }
      },
    );

    // Handle error if user credentials already in use
    if (user) {
      req.flash('error', 'Username or Email already in use.');
      reject(Error('MongoDB Key Duplication. User already exists'));
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

    const userToken = await jwtUtils
      .generate(userData, (err, token) => {
        if (err) {
          reject(Error('Unable to generate user token'));
        }
        resolve(token);
      })
      .then((token) => {
        console.log('token:', token);
        res.setHeader('Imagenius-authorization', token);
      })
      .catch((err) => next(err));
    resolve();
  })
    .then(() => {
      // If none errors, redirect to signin view
      res.redirect('/users/signin');
    })
    .catch((err) => {
      // If errors exists, redirect to signup view
      res.redirect('/users/signup');
      // And log up the error
      next(err);
    });
};

usersCtrl.renderSignInForm = (req, res) => {
  res.render('signin');
};

module.exports = usersCtrl;
