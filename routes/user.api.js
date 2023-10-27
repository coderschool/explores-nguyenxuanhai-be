const express = require("express");
const { body, param, query } = require("express-validator");
const userController = require("../controllers/user.controllers");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

const router = express.Router();

/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.createUser
);

/**
 * @route GET api/users
 * @description Get a list of users
 * @access private
 */
router.get(
  "/",
  authentication.accessRequired,
  authentication.managerRequired,
  userController.getUsers
);

/**
 * @route GET api/users
 * @description Get a list of users by project
 * @access private
 */
router.get(
  "/projects/:projectId",
  authentication.accessRequired,
  // authentication.managerRequired,
  validators.validate([
    param("projectId").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.getUsersByProject
);

/**
 * @route GET api/users/me
 * @description Get info of current user
 * @access private
 */
router.get(
  "/me",
  authentication.accessRequired,
  // authentication.managerRequired,
  userController.getCurrentUser
);

/**
 * @route POST api/users/me/change_password
 * @description Change password of current user
 * @access private
 */
router.post(
  "/me/change_password",
  authentication.accessRequired,
  // authentication.managerRequired,
  validators.validate([
    body("currentPassword", "Invalid current password").exists().notEmpty(),
    body("newPassword", "Invalid new password").exists().notEmpty(),
  ]),
  userController.changePassword
);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get("/:id", validators.validate([]), userController.getSingleUser);

/**
 * @route DELETE api/users/:id
 * @description Delete user by id
 * @access private
 */
router.delete("/:id", validators.validate([]), userController.deleteUser);

module.exports = router;
