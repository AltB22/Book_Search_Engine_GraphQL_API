const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

  module.exports = {
    authMiddleware: function ({ req }) {
      let token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return req;
      }
  
      try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        req.user = data;
      } catch (err) {
        console.error(err);
        throw new Error('Invalid token');
      }
  
      return req;
    },
    
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
