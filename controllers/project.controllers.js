const mongoose = require("mongoose");
const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");
const Project = require("../models/Project");

const projectController = {};

projectController.createProject = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  const { name, description } = req.body;

  const project = await Project.create({ name, description });

  sendResponse(res, 200, true, project, null, "Create task success");
});

projectController.getAllProjects = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  const filter = { isDeleted: false };
  let projects = await Project.find(filter).sort({ createdAt: -1 });

  sendResponse(res, 200, true, projects, null, "Get all tasks success");
});

projectController.getSingleProject = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  const projectId = req.params.id;

  const filter = { _id: projectId };
  const project = await Project.find(filter);
  if (!project) throw new AppError(400, "Bad request", "Project not found!");

  sendResponse(res, 200, true, project, null, "Get single project success");
});

projectController.deleteProject = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  const { id } = req.params;

  const deleted = await Project.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true }
  );
  if (!deleted) throw new AppError(400, "Bad request", "Project not found!");
  sendResponse(res, 200, true, deleted, null, "Delete project success");
});

projectController.editProject = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  let projectId = req.params.id;
  let project = await Project.findById(projectId);
  if (!project) throw new AppError(400, "Bad request", "Project not found");

  // can only update certain fields
  const allows = ["description"];
  allows.forEach((field) => {
    // update if field isn't empty
    if (req.body[field] !== undefined) {
      project[field] = req.body[field];
    }
  });

  project = await project.save();

  sendResponse(res, 200, true, project, null, "Update project success");
});

module.exports = projectController;
