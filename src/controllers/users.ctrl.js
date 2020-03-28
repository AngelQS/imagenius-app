// Local
const {
  hapi_joi: userValidationSchema,
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

    // Hash the password
    newUser.password = await newUser.encryptPassword(result.value.password);

    // Generate secret token
    const data = {
      // data to feed token
      id: newUser._id,
      email: newUser.email,
    };
    const userToken = await jwtUtils.generate(data);
    newUser.token = userToken;

    console.log(newUser);
    await newUser.save();

    // Inserting token to email template to send a sms to user
    const html = insertTokenToHTML(newUser.token);

    // Making message to send a sms to user
    const messageStatus = makeMessage(newUser.email, html);
    if (messageStatus) {
      console.log('MENSAJE ENVIADO');
    } else {
      req.flash('Something went wrong! Please try sign up later.');
      req.redirect('/users/signup');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = usersCtrl;
