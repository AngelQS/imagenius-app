/**
 * @module User Controller
 * @category Modules
 * @subcategory Controllers
 */

// Local
const {
  jwt: jwtService,
  //sendgrid: sendMessage,
} = require("../config/index.config");
const { User } = require("../models/index.model");
//const insertTokenToHTML = require('../components/email.component');

// Initializations
/**
 * @namespace userCtrl
 * @property {method} renderSignUpForm Renders the sign up page.
 * @property {method} SignUp Sign up logic.
 * @property {method} renderSignInForm Renders the sign in page.
 */
const userCtrl = {};

/**
 * @description Renders the sign up page.
 * @method renderSignUpForm
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @param {function} next Express Next middleware function.
 * @returns {undefined} Sign up view.
 */
userCtrl.renderSignUpForm = (req, res, next) => {
  try {
    return res.render("users/signup"); // users/mobile-phone-validation
  } catch (err) {
    return next(err);
  }
};

/**
 * @description Error when running controller.
 * @typedef Error
 * @property {object} err Error object.
 */

/**
 * @description Payload based on user data.
 * @typedef Payload
 * @property {string} _id The user id.
 * @property {string} username The user name.
 * @property {string} email The user email.
 */

/**
 * @description Controller that manage the user sign up.
 * @method signUp
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @param {function} next Express Next middleware function.
 * @returns {Promise<Payload|Error>} Redirects to sign in view.
 */
userCtrl.signUp = async (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.data is null
    if (!req.data) {
      return reject(Error("Unable to find user data"));
    }

    // Getting user data from req.data
    const data = req.data;

    // Checking if user already exists
    const username = data.value.username;
    const email = data.value.email;

    try {
      const user = await User.exists({
        $or: [{ username }, { email }],
      });
      if (user) {
        req.flash("error", "Username or Email already in use");
        return res.redirect("signup");
      }
    } catch (err) {
      req.flash("Something went wrong. Please try again later");
      return res.redirect("signup");
    }

    // Save user to database
    await delete data.value.confirmationPassword;
    const newUser = await new User(data.value);

    // Generating user token payload
    const userData = {
      _id: newUser._id,
      username: newUser.username.toLowerCase(),
      email: newUser.email.toLowerCase(),
    };

    // Saving the user
    try {
      newUser.save();
      return resolve(userData);
    } catch (err) {
      req.flash("error", "Something went wrong. Please try again later");
      return reject(Error("Unable to save new user"));
    }
  })
    .then((userData) => {
      // If none errors, redirect to signin view
      req.flash(
        "success",
        "Please, activate your account through verification code we send you"
      );
      req.tokenPayload = userData;
      res.redirect("signin");
      return next();
    })
    .catch((err) => {
      // If errors exists, redirect to error view And log up the error
      req.error = err;
      return next(req.error);
    });
};

/**
 * @description Renders the sign in page.
 * @method renderSignInForm
 * @param {object} req Request object.
 * @param {object} res Response object.
 * @param {object} next Next object.
 * @returns {undefined} Sign in view.
 */
userCtrl.renderSignInForm = (req, res, next) => {
  try {
    //
    return res.render("users/signin");
  } catch (err) {
    return next(err);
  }
};

/**
 * @description Renders the phone number verification page.
 * @method renderPhoneNumberVerification
 * @param {object} req Request object.
 * @param {object} res Response object.
 * @param {object} next Next object.
 * @returns {undefined} Phone number verification view.
 */
userCtrl.renderPhoneNumberVerification = (req, res, next) => {
  try {
    return res.render("users/mobile-phone-verification");
  } catch (err) {
    return next(err);
  }
};

/**
 * @description Controller that sends the verification code to user phone number.
 * @method verifyPhoneNumber
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @param {function} next Express Next middleware function.
 * @returns {Promise<numberError>} Redirects to code verification view.
 */
userCtrl.verifyPhoneNumber = (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // verificar la existencia de las query middleware
    // capturar las query middleware
    // validar el token middleware
    // capturar el req.body.phoneNumber
    // enviar un mensaje de texto o llamada
  })
    .then()
    .catch((err) => {
      next(err);
    });
};

module.exports = userCtrl;
