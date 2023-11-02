const express = require("express");
const taskController = require("../controllers/task.controllers");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const authentication = require("../middlewares/authentication");
const commentController = require("../controllers/comment.controllers");

const router = express.Router();

/**
 * @route POST api/comments
 * @description Create a new comment
 * @access private
 */
router.post(
  "/",
  authentication.accessRequired,
  validators.validate([
    body("content", "Invalid comment content").exists().notEmpty().isString(),
    body("aboutTask", "Invalid task ID")
      .exists()
      .custom(validators.checkObjectId),
  ]),
  commentController.createComment
);

/**
 * @route GET api/comments/tasks/:taskId
 * @description Get a list of comments about a task
 * @access private
 */
router.get(
  "/tasks/:taskId",
  authentication.accessRequired,
  validators.validate([
    param("taskId").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.getCommentsByTask
);

module.exports = router;
