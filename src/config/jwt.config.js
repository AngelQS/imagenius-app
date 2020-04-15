// Third
const jwt = require('jsonwebtoken');
const fse = require('fs-extra');

// Local
const { IMAGENIUS_APP_SECRET: privateKey } = require('./env_vars.config');
const { User } = require('../models/index.model');

// Initialization
// const privateKey = fse.readFileSync('public.pem')
const jwtUtils = {};
const secret = privateKey || 'privateKey';
const expiresTime = 3600000;

jwtUtils.generate = (data) => {
  const userToken = new Promise((resolve, reject) => {
    const token = jwt.sign(
      { data },
      secret,
      { expiresIn: expiresTime },
      //{ algorithm: 'HS512' },
      (err, token) => {
        setTimeout(async () => {
          // Searching user to validate if his account has been verified.
          const user = await User.findById(data.id);

          // Handle error if there is no user
          if (!user) {
            return reject(
              Error(
                'Unable to find user to validate if his account has been verificated.',
              ),
            );
          }

          // Searching if user account is activated
          if (!user.active) {
            await User.deleteOne({ _id: data.id });
          }
        }, 10000);
      },
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
