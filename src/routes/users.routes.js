/**
 * @module User Routes
 * @category Modules
 * @subcategory Routes
 */

// Third
const { Router } = require("express");

// Middlewares
const {
  inputDataValidation,
  inputDataErrorHandler,
  generateToken,
  makeSendgridMessage,
  //makeSendgridMessage,
  verifyQueries,
  matchQueryWithUserToken,
  phoneNumberValidation,
} = require("../middlewares/user.middlewares");

// Initializations
const usersRouter = Router();
const {
  renderSignUpForm,
  signUp,
  renderSignInForm,
  renderPhoneNumberVerification,
  sendTwilioVerificationCode,
} = require("../controllers/user.ctrl");

// Sign Up route
usersRouter
  .route("/users/signup")

  /**
   * @description Gets the sign up view.
   * @name Render Sign Up
   * @path {GET} /users/signup
   */
  .get(renderSignUpForm)

  /**
   * @description User sign up logic.
   * @name User Sign Up
   * @path {POST} /users/signup
   */
  .post(
    inputDataValidation,
    inputDataErrorHandler,
    signUp,
    generateToken,
    makeSendgridMessage
  );

// Sign In route
usersRouter
  .route("/users/signin")

  /**
   * @description Gets the sign in view.
   * @name Render Sign In
   * @path {GET} /users/signin
   */
  .get(renderSignInForm);

// Account verification
usersRouter
  .route("/accounts/verify")

  /**
   * @description Gets the phone number verification view.
   * @name Render Phone Number Verification
   * @path {GET} /accounts/verify
   */

  .get(verifyQueries, matchQueryWithUserToken, renderPhoneNumberVerification)
  /**
   * @description Sends the verification code to user phone number.
   * @name Send Verification Code
   * @path {POST} /accounts/verify
   */
  .post(phoneNumberValidation, sendTwilioVerificationCode);

module.exports = usersRouter;
