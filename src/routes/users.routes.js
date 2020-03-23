// Third
const { Router } = require('express');

// Initializations
const usersRouter = Router();
const usersCtrl = require('../controllers/users.ctrl');

usersRouter
  // Sign Up route
  .route('/users/signup')

  .get(usersCtrl.renderSignUpForm)
  .post(usersCtrl.signUp);

module.exports = usersRouter;
