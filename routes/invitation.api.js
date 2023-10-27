const express = require("express");
const validators = require("../middlewares/validators");
const invitationController = require("../controllers/invitation.controllers");
const { body, query } = require("express-validator");
const authentication = require("../middlewares/authentication");

const router = express.Router();

/**
 * @route POST api/invitations
 * @description create a new invitation
 * @access private, manager
 */
router.post(
  "/",
  authentication.accessRequired,
  authentication.managerRequired,
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("name", "Invalid name").exists().isString().notEmpty(),
  ]),
  invitationController.createInvitation
);

/**
 * @route GET api/invitations/confirm_email
 * @description
 * @access public
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
