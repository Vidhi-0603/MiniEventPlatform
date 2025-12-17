const { cookieOptions } = require("../config/cookie.config");
const {
  registerUser,
  loginUser,
  authUser,
} = require("../services/auth.service");

const register_user = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const { token, user } = await registerUser(username, email, password);

    res.cookie("accessToken", token, cookieOptions);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login_user = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);

    res.cookie("accessToken", token, cookieOptions);
    res.status(200).json({
      message: "User login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};
const auth_user = async (req, res, next) => {
  try {
    const user = await authUser(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register_user, login_user, auth_user };