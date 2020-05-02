/**
 * @module JWT
 * @category Modules
 * @subcategory Services
 */

// Third
const jwt = require("jsonwebtoken");
//const fse = require('fs-extra');

// Local
const { IMAGENIUS_APP_JWT_SECRET: secretKey } = require("./env_vars.config");

// Initialization
// const privateKey = fse.readFileSync('public.pem')

/**
 * @namespace jwtService
 * @property {method} encode Signs token based on user data.
 * @property {method} decode Receives a token to verify it.
 */
const jwtService = {};

/** Secret to sign a token.
 * @type {string}
 */
const secret = secretKey;

/** Token expiration time.
 * @type {number|string}
 */
const expiresTime = 86400000;

/**
 * @description Method that returns a signed token based on user data.
 * @method encode
 * @param  {object} data User data to sign a token.
 * @returns {Promise<object>} A signed token.
 *
 * @mermaid
 * sequenceDiagram
 *   participant App
 *   participant JWT
 *   App->>JWT: data
 *   activate JWT
 *   JWT-->>App: token
 *   Note right of JWT: Token signed with user data
 */
jwtService.encode = (data) => {
  const userToken = new Promise((resolve, reject) => {
    try {
      /**
       * @description Signs the token.
       * @inner
       * @method encode:sign
       * @param {object} data Token to be verified.
       * @param {string} secret Secret Key to verify the token.
       * @param {string|number} expiresIn Set the token expire time.
       * @returns {string} Token signed.
       */
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

/**
 * @description Method that receives a token to verify it.
 * @method decode
 * @param  {string} token Token to get verification.
 * @returns {Promise<object>} The token status.
 */
jwtService.decode = (token) => {
  const isValid = new Promise((resolve, reject) => {
    /**
     * @description Verifies the token.
     * @inner
     * @method decode:verify
     * @param {string} token Token to be verified.
     * @param {string} secret Secret Key to verify the token.
     * @returns {Promise<object>} Token validation status.
     */
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

module.exports = jwtService;
