const express = require("express");
const validators = require("../middlewares/validators");
const resetController = require("../controllers/reset.controllers");
const { body, query } = require("express-validator");
const authentication = require("../middlewares/authentication");

const router = express.Router();

router.post(
  "/",
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
  ]),
  resetController.createReset
);

router.get(
  "/reset_page",
  validators.validate([
    query("email", "Invalid email").exists().isEmail(),
    query("token", "Invalid Reset Token").exists().isString(),
  ]),
  resetController.goToResetPage
);

router.post(
  "/reset_password",
  validators.validate([
    query("email", "Invalid email").exists().isEmail(),
    query("token", "Invalid Reset Token").exists().isString(),
    body("password", "Invalid password").exists().isString(),
  ]),
  resetController.resetPassword
);

module.exports = router;
