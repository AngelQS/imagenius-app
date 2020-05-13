// Local
const client = require("./client");
const { envVars } = require("../../config/index.config");

// Initializations
const verifyService = {};
const SERVICE_ID = envVars.TWILIO_SERVICE_ID;

verifyService.sendCode = (to, channel = "sms") => {
  const status = new Promise(async (resolve, reject) => {
    let result = {};

    // Service options, phone number and channel
    const options = {
      to,
      channel,
    };

    // Sending the code using using the chosen channel
    client.verify
      .services(SERVICE_ID)
      .verifications.create(options)
      .then((data) => {
        result.data = data;
      })
      .catch((err) => {
        result.error = err;
      });

    // Resolving promise if not null
    return resolve(result);
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });

  return status;
};

verifyService.validateCode = (to, code) => {
  const status = new Promise(async (resolve, reject) => {
    let result = {};

    // Service options, phone number and verification code
    const options = {
      to,
      code,
    };

    // Checking the code
    client.verify
      .services(SERVICE_ID)
      .verificationChecks.create(options)
      .then((data) => {
        result.data = data;
      })
      .catch((err) => {
        result.error = err;
      });

    // Resolving promise if not null
    return resolve(result);
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });

  return status;
};

module.exports = verifyService;
/* const sendSMS = (userPhoneNumber, verificationCode) => {
  try {
    client.messages.create({
      body: 
    });
  } catch (err) {}
}; */

/* client.messages
  .create({
    to: MY_PHONE_NUMBER,
    from: TWILIO_PHONE_NUMBER,
    body: "Your verification code is: 4964816",
  })
  .then((message) => {
    console.log(message.sid);
  })
  .catch((err) => {
    console.log(err);
  }); */

// Servidor que recibe los mensajes del usuario
/* const MessagingResponse = require("twilio").twiml.MessagingResponse;

app.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message("He recibido tu mensaje");
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
}); */
