// Local
const {
  jwt: jwtUtils,
  sendgrid: makeMessage,
} = require('../config/index.config');
const { User } = require('../models/index.model');
const insertTokenToHTML = require('../components/email.component');

// Initializations
const usersCtrl = {};

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('signup');
};

usersCtrl.signUp = async (req, res) => {
  //console.log('req.body:', req.body);
  //console.log('req.cookies:', req.cookies);
  //console.log('req.signedCookies:', req.signedCookies);
  //console.log('req.headers:', req.headers);
  //console.log('req.headers.authorization:', req.headers.authorization);
  if (!req.data) {
    req.flash('error', 'A problem has ocurred. Please try again later.');
    res.redirect('/users/signup');
    throw new Error('Internal Server Error: Request data does not exist.');
  }
  console.log('SALIENDO DE !REQ.DATA');
  // Getting data from previous middleware
  const data = req.data;

  // Handling errors on data
  if (data.error) {
    const errorMessage = data.error.details[0].message;
    req.flash('error', errorMessage);
    res.redirect('/users/signup');
    console.log('HA SIDO REDIRECCIONADO');
  }
  console.log('SALIENDO DE DATA.ERROR');
  console.log('CREANDO EL USUARIO');

  const user = await User.checkIfExists(data.value.username, data.value.email);
  if (user) {
    console.log('IMPRIMIENDO SI EL USUARIO EXISTE PARA REDIRIGIRLO');
    console.log('USER ON CONTROLLER:', user);
    console.log('A PUNTO DE REDIRIGIR');
    req.flash('error', 'Username or Email already in use.');
    res.redirect('/users/signup');
    console.log('USUARIO REDIRIGIDO A SIGNUP');
  }

  // Checking if email and username is already taken
  /* const users = await User.find({
      $or: [{ email: data.value.email }, { username: data.value.username }],
    });
    users.forEach(async (user) => {
      if (user.email == data.value.email) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/users/signup');
      }
      if (user.username == data.value.username) {
        req.flash('error', 'Username is already in use.');
        res.redirect('/users/signup');
      }
    }); */
  console.log('PASO');
  // Save user to database
  await delete data.value.confirmationPassword;
  const newUser = await new User(data.value);

  // Hash the password
  console.log('ENCRIPTANDO CONTRASEÑA');
  newUser.password = await newUser.encryptPassword(data.value.password);
  console.log('newUser.password:', newUser.password);
  // Generate secret token
  const datax = {
    // data to feed token
    id: newUser._id,
    email: newUser.email,
  };
  console.log('GENERANDO TOKEN');
  const userToken = await jwtUtils.generate(datax);
  newUser.token = userToken;

  console.log('GUARDANDO USUARIO');
  //console.log(newUser);
  await newUser.save();

  // Inserting token to email template to send a sms to user
  const html = insertTokenToHTML(newUser.token);

  // Making message to send a sms to user
  const messageStatus = await makeMessage(newUser.email, html);
  if (messageStatus) {
    console.log('EL MENSAJE SE ENVIO');
  } else {
    console.log('ERROR ENVIANDO MENSAJE');
    req.flash('Something went wrong! Please try sign up later.');
    res.redirect('/users/signup');
  }
  //console.log('ASIGNANDO CABECERA DE TOKEN');
  //res.set('x-access-token', `${userToken}`);
  console.log('REDIRIGIR A SIGNIN');
  res.redirect('/users/signin');
};

usersCtrl.renderSignInForm = (req, res) => {
  res.render('signin');
};

module.exports = usersCtrl;
