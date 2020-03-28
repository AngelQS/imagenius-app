// Third
const sgMail = require('@sendgrid/mail');

// Local
const envVars = require('./env_vars.config');

// Initializations
sgMail.setApiKey(envVars.TWILIO_SENDGRID_AUTH_KEY);

const makeMessage = async (to, html) => {
  try {
    const msg = {
      to,
      from: 'aedwin.acuario31@gmail.com',
      subject: 'Email verification',
      text: 'and easy to do anywhere, even with Node.js',
      html,
    };
    await sgMail.send(msg);
    console.log('Message has been send');
    return true;
  } catch (err) {
    console.log('ERROR ON SENDING SENGRID MESSAGE:', err);
    return false;
  }
};

module.exports = makeMessage;

/* const msg = {
  to: 'aedwin.acuario31@gmail.com',
  from: 'aedwin.acuario31@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}; */

//sgMail.send(message);
