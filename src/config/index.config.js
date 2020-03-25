const configs = {
  envVars: require('./env_vars.config'),
  hapi_joi: require('./hapi_joi.config'),
  jwt: require('./jwt.config'),
  sendgrid: require('./sendgrid.config'),
};

module.exports = configs;
