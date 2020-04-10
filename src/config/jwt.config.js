// Third
const jwt = require('jsonwebtoken');
const fse = require('fs-extra');

// Local
const { IMAGENIUS_APP_SECRET: privateKey } = require('./env_vars.config');

// Sign with ES512
// const privateKey = fse.readFileSync('public.pem')
const secret = privateKey || 'privateKey';

const jwtUtils = {};

jwtUtils.generate = (data) => {
  const userToken = new Promise((resolve, reject) => {
    const token = jwt.sign(
      { data },
      secret,
      { expiresIn: '10 days' },
      //{ algorithm: 'HS512' },
    );
    if (!token) {
      reject(Error('Unable to generate user token'));
    }
    resolve(token);
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
      reject(Error('Invalid token'));
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
