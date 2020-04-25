// Third
const sgMail = require("@sendgrid/mail");

// Local
const envVars = require("./env_vars.config");
const insertTokenToHTML = require("../components/email.component");

// Initializations
const SENDGRID_AUTH_KEY = envVars.TWILIO_SENDGRID_AUTH_KEY;

// Setting auth key to sendgrid
sgMail.setApiKey(SENDGRID_AUTH_KEY);

// Making the message to send to user email
const sendMessage = async (to, token) => {
  try {
    // Inserting token to email verification page
    const html = insertTokenToHTML(token);
    const msg = {
      to,
      from: "aedwin.acuario31@gmail.com",
      subject: "Email verification",
      text: "Verify your Imagenius account",
      html,
    };
    await sgMail.send(msg);
    console.log("Message has been send");
    return true;
  } catch (err) {
    console.log("ERROR ON SENDING SENGRID MESSAGE:", err);
    return false;
  }
};

module.exports = sendMessage;
