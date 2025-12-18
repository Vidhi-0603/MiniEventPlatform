const express = require("express");
const {
  register_user,
  login_user,
  auth_user,
  logoutUser,
} = require("../controllers/auth.controller");
const isAuthenticated = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", register_user);

router.post("/login", login_user);
router.get("/me", isAuthenticated, auth_user);

router.post("/logout", isAuthenticated, logoutUser);
module.exports = router;