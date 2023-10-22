const express = require("express");
const validators = require("../middlewares/validators");
const { body, cookie } = require("express-validator");
const authController = require("../controllers/auth.controllers");
const authentication = require("../middlewares/authentication");
const router = express.Router();

/**
 * @route POST /auth/login
 * @description login with email and password
 * @body {email, password}
 * @access Public
 */
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.loginWithEmail
);

/**
 * @route POST /auth/refresh
 * @description
 * @body
 * @access login required
 */
router.post(
  "/refresh",
  validators.validate([cookie("jwt", "Login session expired").exists()]),
  authController.refreshAccess
);

/**
 * @route DELETE /auth/logout
 * @description
 * @body
 * @access login required
 */
router.delete(
  "/logout",
  authentication.accessRequired,
  // validators.validate([cookie("jwt", "Login session expired").exists()]),
  authController.logout
);

module.exports = router;
