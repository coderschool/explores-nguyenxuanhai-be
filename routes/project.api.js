const express = require("express");
const taskController = require("../controllers/task.controllers");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const authentication = require("../middlewares/authentication");
const projectController = require("../controllers/project.controllers");

const router = express.Router();

/**
 * @route POST api/projects
 * @description Create a new project
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
  ]),
  projectController.createProject
);
module.exports = router;
