// Third
const { Router } = require('express');

// Middlewares
const userMiddlewares = require('../middlewares/user.middlewares');

// Initializations
const usersRouter = Router();
const usersCtrl = require('../controllers/users.ctrl');

usersRouter
  // Sign Up route
  .route('/users/signup')

  .get(usersCtrl.renderSignUpForm)
  .post(userMiddlewares.RegistryFormDataValidation, usersCtrl.signUp);

usersRouter
  // Sign In route
  .route('/users/signin')

  .get(usersCtrl.renderSignInForm);

module.exports = usersRouter;
