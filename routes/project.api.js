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
    body("name", "Invalid project name").exists().notEmpty().isString(),
    body("description", "Invalid description").exists().notEmpty().isString(),
  ]),
  projectController.createProject
);

/**
 * @route GET api/projects
 * @description Get a list of all projects
 * @access private
 * @allowedQueries: name
 */
router.get(
  "/",
  authentication.accessRequired,
  // authentication.managerRequired,
  validators.validate([]),
  projectController.getAllProjects
);

/**
 * @route GET api/projects/users/:userId
 * @description Get a list of projects of which a user is a member
 * @access private
 * @allowedQueries: name
 */
router.get(
  "/users/:userId",
  authentication.accessRequired,
  // authentication.managerRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.getProjectsByUser
);

/**
 * @route GET api/projects/:id
 * @description Get a single project by id
 * @access private
 */
router.get(
  "/:id",
  authentication.accessRequired,
  // authentication.managerRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.getSingleProject
);

/**
 * @route DELETE api/projects/:id
 * @description Delete project by id
 * @access private
 */
router.delete(
  "/:id",
  authentication.accessRequired,
  authentication.managerRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.deleteProject
);

/**
 * @route PUT api/projects/:id
 * @description update a project
 * @access private
 */
router.put(
  "/:id",
  authentication.accessRequired,
  authentication.managerRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.editProject
);

module.exports = router;
