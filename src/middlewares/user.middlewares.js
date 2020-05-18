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
  lookupService,
  verifyService,
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
    // Handle error if req.body is null
    if (!req.body) {
      return reject(Error("Unable to get request body"));
    }

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
    // Handle error if req.verificationToken is null
    if (!req.verificationToken) {
      return reject(Error("Unable to send Sendgrid message"));
    }

    // Handle error if req.tokenPayload is null
    if (!req.tokenPayload) {
      return reject(Error("Unable to get token payload on request"));
    }

    // Getting verification token from req.verificationToken
    const verificationToken = req.verificationToken;

    // Getting user email from req.tokenPayload
    const email = req.tokenPayload.email;

    // Making sendgrid message
    const messageStatus = sgService.sendMessage(email, verificationToken);
    // Validating the result
    if (!messageStatus) {
      return reject(Error("Unable to make Sendgrid message"));
    }
    // Resolving the problem if it has no errors
    return resolve();
  })
    .then(() => {
      // Saving the message status
      //req.messageStatus = messageStatus;
    })
    .catch((err) => {
      //req.flash("Something went wrong. Please try again later");
      //res.redirect("error/email-verification-error");
      return next(err);
    });
};

userMiddlewares.getParams = (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.query is null
    if (!req.params) {
      return reject(Error("Unable to find the param token"));
    }

    // Getting the token from req.params.token
    const data = req.params;

    // Resolving the promise if not null
    return resolve(data);
  })
    .then((data) => {
      // Saving the activation token
      req.data = data;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

userMiddlewares.matchParamsWithUserToken = async (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.data.activationToken is null
    if (!req.data.activationToken) {
      return reject(Error("Unable to find the activation token"));
    }
    // Getting the activation token from req.data.activationToken
    const activationToken = req.data.activationToken;

    // Decoding the token to find user
    const tokenDecoded = await jwtService.decode(activationToken);

    // Throwing error if user token does not exist
    if (!tokenDecoded) {
      return reject(Error("Unable to decode user token. Invalid user token"));
    }

    // Getting the decoded user data
    const { _id, username, email } = tokenDecoded.data;

    // Finding the user with activation token
    const user = await User.findOne({
      $and: [{ _id }, { username }, { email }],
    });

    // Handle error if user does not exist
    if (!user) {
      return reject(Error("Unable to find user. It does not exist"));
    }

    // Getting the user account status
    const isVerified = user.isVerified;

    // Redirect to sign up view if user account is verified
    if (isVerified) {
      return res.redirect("users/signup");
    }

    // Resolving the promise if user token exist
    return resolve(user);
  })
    .then((user) => {
      // Saving the user to req.userDecoded
      req.userDecoded = user;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

userMiddlewares.phoneNumberValidation = (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.phoneNumber is null
    if (!req.body.phoneNumber) {
      return reject(Error("Unable to get request body"));
    }

    // Getting the phoneNumber from req.body.phoneNumber
    const phoneNumber = req.body.phoneNumber;

    // Validating phone number
    const status = await lookupService.lookupPhoneNumber(phoneNumber);

    // Redirect if phone number is invalid
    if (status.error) {
      req.flash("error", "Invalid phone number");
      return res.redirect("back");
    }

    // Resolving promise if not null
    return resolve(phoneNumber);
  })
    .then((phoneNumber) => {
      // Saving the phone number
      req.phoneNumber = phoneNumber;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

userMiddlewares.codeValidation = (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.body.verificationCode is null
    if (!req.body.verificationCode) {
      return reject(Error("Unable to get verification code"));
    }

    // Getting the verification code from req.body.verificationCode
    const verificationCode = req.body.verificationCode;

    // Validating the code
    if (verificationCode.length !== 6) {
      req.flash("error", "Verification code length must not be 6");
      return res.redirect("back");
    }

    // Resolving promise if not null
    return resolve(verificationCode);
  })
    .then((verificationCode) => {
      // Saving the verification code
      req.verificationCode = verificationCode;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

userMiddlewares.getQueries = (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.query.pn is null
    if (!req.query.pn) {
      return reject(Error("Unable to get phone number on the query"));
    }

    // Getting the phone number from req.query.pn
    const phoneNumber = `+${req.query.pn.trim()}`;

    console.log(
      "IMPRIMIENDO QUERY DESDE EL PN LLLLLLLLLLLLLLLLL:",
      req.query.pn
    );
    // Resolving promise if not null
    return resolve(phoneNumber);
  })
    .then((phoneNumber) => {
      req.phoneNumber = phoneNumber;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

userMiddlewares.verifyTwilioVerificationCode = (req, res, next) => {
  new Promise(async (resolve, reject) => {
    // Handle error if req.verificationCode is null
    if (!req.verificationCode) {
      return reject(Error("Unable to get verification code on request"));
    }

    // Handle error if req.phoneNumber is null
    if (!req.phoneNumber) {
      return reject(Error("Unable to get phoneNumber on the request"));
    }

    // Getting the verification code from req.verificationCode
    const verificationCode = req.verificationCode;

    // Getting the phone number from req.phoneNumber
    const phoneNumber = req.phoneNumber;

    console.log(
      "VERIFICANDO NUMERO ANTES DE ENVIARLO XXXXXXXXXXXXXXXX:",
      phoneNumber
    );
    // Verifying the code
    const message = await verifyService.validateCode(
      phoneNumber,
      verificationCode
    );

    console.log("MESSAGE OF VERIFICATION CODE ????????", message);

    return resolve(message);
  })
    .then((verificationStatus) => {
      req.verificationStatus = verificationStatus;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

module.exports = userMiddlewares;
