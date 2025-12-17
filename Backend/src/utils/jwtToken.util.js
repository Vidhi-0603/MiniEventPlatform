const jwt = require("jsonwebtoken");

const getJWTToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { getJWTToken };