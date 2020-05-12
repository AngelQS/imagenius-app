// Local
const envVars = require("../../config/env_vars.config");

// Initialization
const ACCOUNT_SID = envVars.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = envVars.TWILIO_AUTH_TOKEN;
//const PHONE_NUMBER = envVars.TWILIO_PHONE_NUMBER;
//const MY_PHONE_NUMBER = "+51943656417";

const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

module.exports = client;
