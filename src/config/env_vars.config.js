const envVars = {
  APP_PORT: process.env.APP_PORT,
  APP_ENVIRONMENT: process.env.APP_ENVIRONMENT,
  IMAGENIUS_APP_MONGODB_DATABASE: process.env.IMAGENIUS_APP_MONGODB_DATABASE,
  IMAGENIUS_APP_MONGODB_HOST: process.env.IMAGENIUS_APP_MONGODB_HOST,
  TWILIO_SENDGRID_AUTH_KEY: process.env.TWILIO_SENDGRID_AUTH_KEY,
};

module.exports = envVars;