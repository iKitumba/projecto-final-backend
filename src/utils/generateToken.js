const jwt = require("jsonwebtoken");

module.exports = (params = {}) => {
  return jwt.sign(params, process.env.SECRET_TOKEN_KEY, {
    expiresIn: 86400,
  });
};
