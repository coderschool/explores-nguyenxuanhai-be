const express = require("express");
const taskController = require("../controllers/task.controllers");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const authentication = require("../middlewares/authentication");

const router = express.Router();

/**
 * @route POST api/tasks
 * @description Create a new task
 * @access private manager
 * @requiredBody: name
 */
router.post(
  "/",
  authentication.accessRequired,
  authentication.managerRequired,
  validators.validate([
    body("name", "Invalid task name").exists().notEmpty().isString(),
    body("description", "Invalid description").exists().notEmpty().isString(),
    body("status", "Invalid status")
      .optional()
      .isIn(["pending", "working", "review", "done", "archived"]),
    body("priority", "Invalid priority")
      .optional()
      .isIn(["low", "normal", "high"]),
    body("inProject", "Invalid project ID")
      .exists()
      .custom(validators.checkObjectId),
    body("assignedTo", "Invalid task ID")
      .optional()
      .custom(validators.checkObjectId),
  ]),
  taskController.createTask
);

/**
 * @route GET api/tasks
 * @description Get a list of all tasks
 * @access private
 * @allowedQueries: name
 */
router.get(
  "/",
  authentication.accessRequired,
  validators.validate([]),
  taskController.getAllTasks
);

/**
 * @route GET api/tasks
 * @description Get a list tasks in a project
 * @access private
 */
router.get(
  "/projects/:projectId",
  authentication.accessRequired,
  validators.validate([
    param("projectId").exists().isString().custom(validators.checkObjectId),
  ]),
  taskController.getTasksByProject
);

/**
 * @route GET api/tasks/:id
 * @description Get a single task by id
 * @access private
 */
router.get(
  "/:id",
  authentication.accessRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  taskController.getSingleTask
);

/**
 * @route DELETE api/tasks/:id
 * @description Delete task by id
 * @access private
 */
router.delete(
  "/:id",
  authentication.accessRequired,
  authentication.managerRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  taskController.deleteTask
);

/**
 * @route PUT api/tasks/:id
 * @description Update a task
 * @access private
 */
router.put(
  "/:id",
  authentication.accessRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("effort", "Invalid effort hours").optional().isNumeric(),
  ]),
  taskController.editTask
);

module.exports = router;
