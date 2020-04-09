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
  try {
    //console.log('req.body:', req.body);
    //console.log('req.cookies:', req.cookies);
    //console.log('req.signedCookies:', req.signedCookies);
    //console.log('req.headers:', req.headers);
    //console.log('req.headers.authorization:', req.headers.authorization);

    // Data input verification
    /* const result = userValidationSchema.validate(req.body);

    // Data input validation */
    /* if (result.error) {
      req.flash('error', result.error.details[0].message);
      console.log('validation error:', result.error.details[0].message);
      res.redirect('/users/signup');
    } */
    console.log('req.data:', req.data);
    //console.log('req.body:', req.body);

    // Getting data from previous middleware
    data = req.data;

    // Checking if email and username is already taken
    const users = await User.find({
      $or: [{ email: data.value.email }, { username: data.value.username }],
    });
    users.forEach(async (user) => {
      if (user.email == result.value.email) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/users/signup');
      }
      if (user.username == result.value.username) {
        req.flash('error', 'Username is already in use.');
        res.redirect('/users/signup');
      }
    });

    // Save user to database
    await delete result.value.confirmationPassword;
    const newUser = await new User(result.value);

    // Hash the password
    newUser.password = await newUser.encryptPassword(result.value.password);

    // Generate secret token
    const datax = {
      // data to feed token
      id: newUser._id,
      email: newUser.email,
    };
    const userToken = await jwtUtils.generate(datax);
    newUser.token = userToken;

    //console.log(newUser);
    await newUser.save();

    // Inserting token to email template to send a sms to user
    const html = insertTokenToHTML(newUser.token);

    // Making message to send a sms to user
    const messageStatus = await makeMessage(newUser.email, html);
    if (messageStatus) {
      console.log('MENSAJE ENVIADO');
    } else {
      req.flash('Something went wrong! Please try sign up later.');
      res.redirect('/users/signup');
    }
    res.set('x-access-token', `${userToken}`);
    res.redirect('signin');
  } catch (err) {
    next(err);
  }
};

usersCtrl.renderSignInForm = (req, res) => {
  res.render('signin');
};

module.exports = usersCtrl;
