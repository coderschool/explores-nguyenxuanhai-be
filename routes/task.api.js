const express = require("express");
const {
  createTask,
  getTasks,
  getSingleTask,
  deleteTask,
  addReference,
  editTask,
} = require("../controllers/task.controllers");
const validators = require("../middlewares/validators");
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
router.post("/", validators.validate([]), createTask);

/**
 * @route GET api/tasks
 * @description Get a list of tasks
 * @access private
 * @allowedQueries: name
 */
router.get("/", validators.validate([]), getTasks);

/**
 * @route GET api/tasks/:id
 * @description Get task by id
 * @access public
 */
router.get("/:id", validators.validate([]), getSingleTask);

/**
 * @route DELETE api/tasks/:id
 * @description Delete task by id
 * @access private
 */
router.delete("/:id", validators.validate([]), deleteTask);

/**
 * @route PUT api/tasks/:id
 * @description update a task
 * @access private
 */
router.put("/:id", validators.validate([]), editTask);

module.exports = router;
