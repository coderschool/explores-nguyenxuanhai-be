const express = require("express");
const taskController = require("../controllers/task.controllers");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const authentication = require("../middlewares/authentication");
const notificationController = require("../controllers/notification.controllers");

const router = express.Router();

/**
 * @route GET api/notifications//user/:userId
 * @description Get a list of notifications for a user
 * @access private
 */
router.get(
  "/users/:userId",
  authentication.accessRequired,
  // authentication.managerRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  notificationController.getNotificationsByUser
);

router.get(
  "/subscribe",
  authentication.accessRequired,
  // authentication.managerRequired,
  validators.validate([
    // param("taskId").exists().isString().custom(validators.checkObjectId),
  ]),
  notificationController.getSubscription
);

module.exports = router;
