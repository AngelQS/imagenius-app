// Local
const client = require("./client");

// Initializations
const verifyService = {};

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
