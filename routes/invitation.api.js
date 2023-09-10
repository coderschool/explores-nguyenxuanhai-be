const express = require("express");
const validators = require("../middlewares/validators");
const invitationController = require("../controllers/invitation.controllers");
const { body, query } = require("express-validator");

const router = express.Router();

/**
 * @route POST api/invitations
 * @description
 * @access private
 */
router.post(
  "/",
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
  ]),
  invitationController.createInvitation
);

/**
 * @route GET api/invitations/confirm_email
 * @description
 * @access private
 */
router.get(
  "/confirm_email",
  validators.validate([
    query("email", "Invalid email").exists().isEmail(),
    query("token", "Invalid Invitation Token").exists().isString(),
  ]),
  invitationController.confirmEmail
);

module.exports = router;
