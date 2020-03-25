// Third
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');

// Sign with ES512
// const privateKey = fs.readFileSync('public.pem')
const privateKey = 'secretKey';

const jwtUtils = {};

jwtUtils.generate = (data) => {
  try {
    const token = jwt.sign(
      { data },
      privateKey,
      { expiresIn: '1' },
      { algorithm: 'HS512' },
    );
    return token;
  } catch (err) {
    console.log('ERROR ON SIGN TOKEN:', err);
  }
};

jwtUtils.validate = (token) => {
  try {
    jwt.verify(token, privateKey);
    console.log('Token is correct!');
  } catch (err) {
    console.log('ERROR ON VERIFY TOKEN:', err);
    // err.name = 'JsonWebTokenError'
    // err.message = 'jwt malformed'
    // err.name = 'TokenExpiredError'
    // err.message = 'jwt expired'
    // err.expiredAt = '2020-03-25T00:53:29.000Z'
  }
};

module.exports = jwtUtils;
