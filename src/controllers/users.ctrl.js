// Local
const {
  hapi_joi: userValidationSchema,
  jwt: jwtUtils,
} = require('../config/index.config');
const { User } = require('../models/index.model');

// Initializations
const usersCtrl = {};

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('signup');
};

usersCtrl.signUp = async (req, res, next) => {
  try {
    // Data input verification
    const result = userValidationSchema.validate(req.body);

    // Data input validation
    if (result.error) {
      req.flash('error', result.error.details[0].message);
      console.log('validation error:', result.error.details[0].message);
      res.redirect('/users/signup');
    }
    //console.log('req.body:', req.body);

    // Checking if email and username is already taken
    const users = await User.find({
      $or: [{ email: result.value.email }, { username: result.value.username }],
    });
    users.forEach(async (user) => {
      if (user.email == result.value.email) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/users/signup');
      }
      if (user.username == result.value.username) {
        req.flash('error', 'Username is already in use.');
        req.redirect('/users/signup');
      }
    });

    // Save user to database
    await delete result.value.confirmationPassword;
    const newUser = await new User(result.value);

    // Hash the password
    newUser.password = await newUser.encryptPassword(result.value.password);

    // Generate secret token
    const data = {
      // data to feed token
      id: newUser._id,
      email: newUser.email,
    };
    const userToken = await jwtUtils.generate(data);
    newUser.token = userToken;

    console.log(newUser);
    await newUser.save();
  } catch (err) {
    next(err);
  }
};

/* const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.get('/', (req, res) => {
  res.json({
    text: 'api works!',
  });
});

app.post('/api/login', (req, res) => {
  const user = { id: 2 };
  // 1: recibe obj del usuario, 2: clave o llave secreta que le permite a jwt tener una manera de cifrar y descifrar el codigo
  // final: token generado
  const token = jwt.sign({ user }, 'my_env_var_secret_token');
  res.json({
    token,
  });
});

app.get('/api/protected', ensureToken, (req, res) => {
  jwt.verify(req.token, 'my_env_var_secret_token', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        text: 'protected',
        data,
      });
    }
  });
});

function ensureToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  console.log('req.headers:', req.headers);
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(3000, () => {
  console.log('Server on port 3000');
}); */

module.exports = usersCtrl;
