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
} = require("../middlewares/user.middlewares");

// Initializations
const usersRouter = Router();
const {
  renderSignUpForm,
  signUp,
  renderSignInForm,
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

module.exports = usersRouter;
