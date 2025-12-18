const { findUserByEmail, findUserById } = require("../dao/findUser");
const bcrypt = require("bcrypt");
const { getJWTToken } = require("../utils/jwtToken.util");
const userModel = require("../models/User.model");

const registerUser = async (username, email, password) => {
  const userExists = await findUserByEmail(email);
  if (userExists) {
    const error = new Error("User already exists");
    error.statusCode = 400; // Add status code
    throw error;
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new userModel({
    username,
    email,
    password: hashedPassword,
  });
  await user.save();

  const token = getJWTToken({ id: user._id });

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email, true);
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401; // Unauthorized
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401; // Unauthorized
    throw error;
  }
  const token = getJWTToken({ id: user._id });
  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  };
};

const authUser = async (userId) => {
  const user = await findUserById(userId);
  return user;
};

module.exports = { registerUser, loginUser, authUser };
