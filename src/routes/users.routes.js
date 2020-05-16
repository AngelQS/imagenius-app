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
  getParams,
  matchParamsWithUserToken,
  phoneNumberValidation,
  codeValidation,
} = require("../middlewares/user.middlewares");

// Initializations
const usersRouter = Router();
const {
  renderSignUpForm,
  signUp,
  renderSignInForm,
  renderPhoneNumberVerification,
  sendTwilioVerificationCode,
  renderCodeVerification,
  verifyAccount,
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
  .route("/user/account/verify/:activationToken")

  /**
   * @description Gets the phone number verification view.
   * @name Render Phone Number Verification
   * @path {GET} /accounts/verify
   */

  .get(getParams, matchParamsWithUserToken, renderPhoneNumberVerification)
  /**
   * @description Sends the verification code to user phone number.
   * @name Send Verification Code
   * @path {POST} /accounts/verify
   */
  .post(getParams, phoneNumberValidation, sendTwilioVerificationCode);

usersRouter
  .route("/user/account/verify/:activationToken/code_verify")

  .get(getParams, renderCodeVerification)
  .post(getParams, codeValidation, verifyAccount);

module.exports = usersRouter;
