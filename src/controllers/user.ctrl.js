/**
 * @module User Controller
 * @category Modules
 * @subcategory Controllers
 */

// Local
const { jwtService } = require("../services/index.service");
const { User } = require("../models/index.model");
const { verifyService } = require("../services/index.service");
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
      await newUser.save();
      return resolve(userData);
    } catch (err) {
      req.flash("error", "Something went wrong. Please try again later");
      return reject(Error(err));
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
    const activationToken = req.data.activationToken;
    return res.render("users/mobile-phone-verification", { activationToken });
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
 * @returns {Promise<number|Error>} Redirects to code verification view.
 */
userCtrl.sendTwilioVerificationCode = (req, res, next) => {
  new Promise(async (resolve, reject) => {
    console.log("REQ DATA ON SEND MSG", req.data);
    // Handle error if req.phoneNumber is null
    if (!req.phoneNumber) {
      return reject(Error("Unable to get phone number on the request"));
    }

    // Handle error if req.data.activationToken is null
    if (!req.data) {
      return reject(Error("Unable to get activation token on params"));
    }

    // Getting the phone number from req.phoneNumber
    const phoneNumber = req.phoneNumber;

    // Getting the activation token from req.data.activationToken
    const activationToken = req.data.activationToken;

    // Sending the verification code
    const message = await verifyService.sendCode(phoneNumber, "sms");
    console.log("STATUS MESSAGE TWILIO:", message);

    // Resolving promise if not null
    const data = {
      phoneNumber,
      activationToken,
    };
    return resolve(data);
  })
    .then((data) => {
      // If none errors, redirect to code verification view
      console.log("REQ.FLASH IMPRIMIENDO MENSAJE FLASH");
      req.flash(
        "success",
        `We have sent the verification code to the telephone number ${data.phoneNumber}`
      );
      console.log("REDIRECCIONANDO");
      return res.redirect(
        `/user/account/verify/${data.activationToken}/code_verify?pn=${data.phoneNumber}`
      );
    })
    .catch((err) => {
      next(err);
    });
};

userCtrl.renderCodeVerification = (req, res, next) => {
  try {
    console.log("REQUEST PARAMS ON VERIFICATION:", req.data);
    const activationToken = req.data.activationToken;
    const phoneNumber = req.phoneNumber;
    const data = {
      activationToken,
      phoneNumber,
    };
    return res.render("users/code-verification3", { data });
  } catch (err) {
    return next(err);
  }
};

userCtrl.verifyAccount = (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.data.activationToken is null
    if (!req.data) {
      return reject(Error("Unable to get verification code on the request"));
    }
    // Getting the activation token from req.data.activationToken
    const activationToken = req.data.activationToken;
    // Decoding the
    const tokenDecoded = await jwtService.decode(activationToken);
    // Throwing error if user token does not exist
    if (!tokenDecoded) {
      return reject(Error("Unable to decode user token. Invalid user token"));
    }

    // Getting the decoded user data
    const { _id, username, email } = tokenDecoded.data;

    // Finding the user with activation token
    const user = await User.findOneAndUpdate(
      {
        $and: [{ _id }, { username }, { email }],
      },
      { isVerified: true }
    );
    // Handle error if user does not exist
    if (!user) {
      return reject(Error("Unable to find user. It does not exist"));
    }

    return resolve();
  })
    .then(() => {
      req.flash("success", "Your account has been verified, you can sign in");
      return res.redirect("/users/signin");
    })
    .catch((err) => {
      return next(err);
    });
};

module.exports = userCtrl;
