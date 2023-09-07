const express = require("express");
const {
  createTask,
  getTasks,
  getSingleTask,
  deleteTask,
  addReference,
  editTask,
} = require("../controllers/task.controllers");
const {
  taskValidator,
  taskEditValidator,
  reqIdValidator,
} = require("../middleware/validators");
const router = express.Router();

/**
 * @route POST api/tasks
 * @description Create a new task
 * @access private, manager
 * @requiredBody: name
 */
router.post("/", taskValidator, createTask);

/**
 * @route GET api/tasks
 * @description Get a list of tasks
 * @access private
 * @allowedQueries: name
 */
router.get("/", getTasks);

/**
 * @route GET api/tasks/:id
 * @description Get task by id
 * @access public
 */
router.get("/:id", reqIdValidator, getSingleTask);

/**
 * @route DELETE api/tasks/:id
 * @description Delete task by id
 * @access private
 */
router.delete("/:id", reqIdValidator, deleteTask);

/**
 * @route PUT api/tasks/:id
 * @description update a task
 * @access private
 */
router.put("/:id", reqIdValidator, taskEditValidator, editTask);

module.exports = router;
