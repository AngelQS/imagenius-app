// Third
const sgMail = require('@sendgrid/mail');

// Local
const envVars = require('./env_vars');

// Initializations
sgMail.setApiKey(envVars.TWILIO_SENDGRID_AUTH_KEY);

const msg = {
  to: 'aedwin.acuario31@gmail.com',
  from: 'aedwin.acuario31@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail.send(message);
