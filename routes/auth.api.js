const express = require("express");
const validators = require("../middlewares/validators");
const { body, cookie } = require("express-validator");
const authController = require("../controllers/auth.controllers");
const authentication = require("../middlewares/authentication");
const passport = require("../middlewares/passport");

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
 * @description refresh credentials
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
 * @description log out of account
 * @body
 * @access Public
 */
router.delete(
  "/logout",
  authentication.accessRequired,
  validators.validate([]),
  authController.logout
);

router.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/login/google/callback",
  passport.authenticate("google", {
    // failureRedirect: "/",
    session: false,
  }),

  authController.loginWithGoogleCallback
);

module.exports = router;
