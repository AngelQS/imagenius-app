// Third
const jwt = require("jsonwebtoken");
//const fse = require('fs-extra');

// Local
const { IMAGENIUS_APP_JWT_SECRET: secretKey } = require("./env_vars.config");
const { User } = require("../models/index.model");

// Initialization
// const privateKey = fse.readFileSync('public.pem')
const jwtUtils = {};
const secret = secretKey || "privateKey";
const expiresTime = 86400000;

jwtUtils.generate = (data) => {
  const userToken = new Promise((resolve, reject) => {
    try {
      const token = jwt.sign({ data }, secret, { expiresIn: expiresTime });
      return resolve(token);
    } catch (err) {
      return reject(err);
    }
  })
    .then((token) => {
      return token;
    })
    .catch((err) => {
      return err;
    });

  return userToken;
};

jwtUtils.validate = (token) => {
  const isValid = new Promise((resolve, reject) => {
    const validation = jwt.verify(token, secret);
    if (!validation) {
      reject(Error("Invalid token"));
    }
    resolve(validation);
  })
    .then((validation) => {
      return validation;
    })
    .catch((err) => {
      // err.name = 'JsonWebTokenError'
      // err.message = 'jwt malformed'
      // err.name = 'TokenExpiredError'
      // err.message = 'jwt expired'
      // err.expiredAt = '2020-03-25T00:53:29.000Z'
      return err;
    });

  return isValid;
};

module.exports = jwtUtils;
