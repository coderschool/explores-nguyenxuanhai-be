const mongoose = require("mongoose");
const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");

const projectController = {};

projectController.createProject = catchAsync(async (req, res, next) => {});

module.exports = projectController;
