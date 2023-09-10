const express = require("express");
// const {
//   createTask,
//   getTasks,
//   getSingleTask,
//   deleteTask,
//   addReference,
//   editTask,
// } = require("../controllers/task.controllers");
const taskController = require("../controllers/task.controllers");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
// const {
//   taskValidator,
//   taskEditValidator,
//   reqIdValidator,
// } = require("../middleware/validators");

const router = express.Router();

/**
 * @route POST api/tasks
 * @description Create a new task
 * @access private, manager
 * @requiredBody: name
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid task name").exists().notEmpty().isString(),
    body("description", "Invalid description").exists().notEmpty().isString(),
    body("status", "Invalid status")
      .optional()
      .isIn([["pending", "working", "review", "done", "archive"]]),
    body("priority", "Invalid priority")
      .optional()
      .isIn([["low", "normal", "high"]]),
    body("inProject", "Invalid project ID")
      .optional()
      .custom(validators.checkObjectId),
    body("assignedTo", "Invalid task ID")
      .optional()
      .custom(validators.checkObjectId),
  ]),
  taskController.createTask
);

/**
 * @route GET api/tasks
 * @description Get a list of tasks
 * @access private
 * @allowedQueries: name
 */
router.get("/", validators.validate([]), taskController.getTasks);

/**
 * @route GET api/tasks/:id
 * @description Get task by id
 * @access public
 */
router.get("/:id", validators.validate([]), taskController.getSingleTask);

/**
 * @route DELETE api/tasks/:id
 * @description Delete task by id
 * @access private
 */
router.delete("/:id", validators.validate([]), taskController.deleteTask);

/**
 * @route PUT api/tasks/:id
 * @description update a task
 * @access private
 */
router.put("/:id", validators.validate([]), taskController.editTask);

module.exports = router;
