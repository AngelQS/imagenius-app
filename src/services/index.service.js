const services = {
  jwtService: require("./jwt.service"),
  sgService: require("./sendgrid.service"),
  lookupService: require("./twilio/lookup.service"),
  verifyService: require("./twilio/verify.service"),
};

module.exports = services;
