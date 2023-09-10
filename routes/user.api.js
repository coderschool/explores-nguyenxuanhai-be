const express = require("express");
const { body, param, query } = require("express-validator");
// const {
//   createUser,
//   getUsers,
//   getSingleUser,
//   deleteUser,
// } = require("../controllers/user.controllers");
const userController = require("../controllers/user.controllers");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
// const { userValidator, reqIdValidator } = require("../middleware/validators");
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
 * @allowedQueries: name
 */
router.get(
  "/",
  authentication.loginRequired,
  authentication.managerRequired,
  userController.getUsers
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
