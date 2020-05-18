/**
 * @module Sendgrid
 * @category Modules
 * @subcategory Services
 */

// Third
const sgMail = require("@sendgrid/mail");

// Local
const { envVars } = require("../config/index.config");
const insertTokenToHTML = require("../components/email.component");

// Initializations
/**
 * @namespace sgService
 * @property {method} sendMessage Sends a email using Twilio services.
 */
const sgService = {};

/** Sendgrid Auth Key.
 * @type {string}
 */
const AUTH_KEY = envVars.SENDGRID_AUTH_KEY;

// Setting auth key to sendgrid
sgMail.setApiKey(AUTH_KEY);

// Making the message to send to user email
/**
 * @description Sends a email using Twilio services.
 * @method sendMessage
 * @param  {string} to Email of the user to whom a message will be sent.
 * @param  {string} token User token to will be pass to insertTokenToHTML function.
 * @returns {Promise<boolean>} Returns the state of message.
 */
sgService.sendMessage = async (to, token) => {
  const messageStatus = new Promise(async (resolve, reject) => {
    // Inserting token to email verification page
    const html = insertTokenToHTML(token);
    const msg = {
      to,
      from: "aedwin.acuario31@gmail.com",
      subject: "Email verification",
      text: "Verify your Imagenius account",
      html,
    };
    /**
     * @description Signs the token.
     * @inner
     * @method sendMessage:send
     * @param {object} msg Message body to be sended.
     * @returns Message status.
     */
    const status = await sgMail.send(msg);
    if (!status) {
      return reject(Error("Unable to send the message"));
    }
    return resolve(status);
  })
    .then((status) => {
      return status;
    })
    .catch((err) => {
      console.log("ERROR ON SENDING SENGRID MESSAGE:", err);
      return err;
    });
  console.log("messageStatus on Service:", messageStatus);
  return messageStatus;
};

module.exports = sgService;
