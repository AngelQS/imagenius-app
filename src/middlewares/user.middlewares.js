/**
 * @module User Middlewares
 * @category Modules
 * @subcategory Middlewares
 */
// Local
const {
  /**
   * User validation schema
   * @type {object}
   * @see userValidationSchema
   */
  hapi_joi: userValidationSchema,
} = require("../config/index.config");

const {
  jwtService,
  /**
   * Sendgrid mail service
   * @type {object}
   * @see {@link module:Services/Sendgrid|Sendgrid Service}
   */
  sgService,
} = require("../services/index.service");
const { User } = require("../models/index.model");

// Initialization
/**
 * @namespace userMiddleware
 * @property {method} inputDataValidation Validates input data.
 * @property {method} inputDataErrorHandler Handles the errors from input data.
 * @property {method} generateToken Receives the user input data to generate a token.
 * @property {method} makeSendgridMessage Send an email to user to verify his account
 */
const userMiddlewares = {};

userMiddlewares.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You must be registered first.");
    return res.redirect("/");
  }
};

userMiddlewares.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("error", "You are already logged in.");
    return res.redirect("/");
  } else {
    return next();
  }
};

/**
 * @description Validates input data.
 * @method inputDataValidation
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @param {function} next Express Next middleware function.
 * @returns {Promise<void>} If none errors, continues with the next middleware, otherwise, is handled by the errorHandler middleware.
 * @see {@link module:Middlewares/Errors|Error Middlewares}
 */
userMiddlewares.inputDataValidation = async (req, res, next) => {
  new Promise((resolve, reject) => {
    // Input data validation
    const result = userValidationSchema.validate(req.body);
    if (!result) {
      return reject(Error("Unable to validate user input data"));
    }

    // Resolving promise if not null
    return resolve(result);
  })
    .then((result) => {
      // Saving the validation result
      req.data = result;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

/**
 * @description Handles the errors from input data.
 * @method inputDataErrorHandler
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @param {function} next Express Next middleware function.
 * @returns {Promise<void>} If none errors, continues with the next middleware, otherwise, is handled by the errorHandler middleware.
 * @see {@link module:Middlewares/Errors|Error Middlewares}
 */
userMiddlewares.inputDataErrorHandler = async (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.data is null
    if (!req.data) {
      req.flash("error", "Something went wrong. Please try again later");
      return res.redirect("signup");
    }
    // Getting user data from req.data
    const data = req.data;
    // Handle error if data containts errors
    if (data.error) {
      const dataError = data.error.details[0].message;
      req.flash("error", dataError);
      return res.redirect("signup");
    }

    // Resolving promise if it has no errors
    return resolve();
  })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

/**
 * @description Receives the user input data to generate a token.
 * @method generateToken
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @param {function} next Express Next middleware function.
 * @returns {Promise<void>} If none errors, continues with the next middleware, otherwise, is handled by the errorHandler middleware.
 * @see {@link module:Middlewares/Errors|Error Middlewares}
 */
userMiddlewares.generateToken = async (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.tokenPayload is null
    if (!req.tokenPayload) {
      req.flash("error", "Something went wrong. Please try again later");
      return res.redirect("signup");
    }
    // Getting user data from req.tokenPayload
    const payload = req.tokenPayload;
    // Generating the token using payload
    const userToken = await jwtService.encode(payload);
    if (!userToken) {
      req.flash("error", "Something went wrong. Please try again later");
      return res.redirect("signup");
    }

    // Resolving the promise if it has no errors
    return resolve(userToken);
  })
    .then((userToken) => {
      // Saving the verification token
      req.verificationToken = userToken;
      return next();
    })
    .catch((err) => {
      //req.flash("error", "Unable to send user token. Please try again later");
      //return res.redirect("errors/email-verification-error");
      next(err);
    });
};

/**
 * @description Send a email to user to verify his account.
 * @method makeSendgridMessage
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @param {function} next Express Next middleware function.
 * @returns {Promise<void>} If none errors, continues with the next middleware, otherwise, is handled by the errorHandler middleware.
 * @see {@link module:Middlewares/Errors|Error Middlewares}
 */
userMiddlewares.makeSendgridMessage = async (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.verificationT  oken is null
    console.log("MAKE SENDGRID MESSAGE");
    if (!req.verificationToken) {
      console.log("!req.verificationToken NO EXISTE");
      return reject(Error("Unable to send Sendgrid message"));
    }
    // Getting verification token from req.verificationToken
    const verificationToken = req.verificationToken;
    console.log("verificationToken:", verificationToken);
    // Making sendgrid message
    const messageStatus = sgService.sendMessage(
      "developer.aqs@gmail.com",
      verificationToken
    );
    console.log("messageStatus:", messageStatus);
    // Validating the result
    console.log("ANTES DEL IF");
    if (!messageStatus) {
      console.log("messageStatus ERROR");
      return reject(Error("Unable to make Sendgrid message"));
    }
    console.log("RESOLVING PROMISE");
    // Resolving the problem if it has no errors
    return resolve();
  })
    .then(() => {
      console.log("COMPLETADO");
      // Saving the message status
      //req.messageStatus = messageStatus;
    })
    .catch((err) => {
      console.log("CATCH ERROR SENDGRID");
      //req.flash("Something went wrong. Please try again later");
      //res.redirect("error/email-verification-error");
      return next(err);
    });
};

module.exports = userMiddlewares;
