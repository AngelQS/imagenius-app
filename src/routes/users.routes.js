// Third
const { Router } = require('express');

// Middlewares
const {
  inputDataValidation,
  inputDataErrorHandler,
} = require('../middlewares/user.middlewares');

// Initializations
const usersRouter = Router();
const {
  renderSignUpForm,
  signUp,
  renderSignInForm,
} = require('../controllers/users.ctrl');

usersRouter
  // Sign Up route
  .route('/users/signup')

  .get(renderSignUpForm)
  .post(inputDataValidation, inputDataErrorHandler, signUp);

usersRouter
  // Sign In route
  .route('/users/signin')

  .get(renderSignInForm);

module.exports = usersRouter;
