const mongoose = require("mongoose");
const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");
const Project = require("../models/Project");
const Comment = require("../models/Comment");

const commentController = {};

commentController.createComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  const { content, aboutTask } = req.body;

  const created = await Comment.create({
    content,
    aboutTask,
    author: currentUserId,
  });

  const comment = await Comment.findById(created._id).populate(
    "author",
    "name _id role"
  );

  sendResponse(res, 200, true, comment, null, "Create comment success");
});

commentController.getCommentsByTask = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  let { taskId } = req.params;

  const comments = await Comment.find({ aboutTask: taskId }).populate(
    "author",
    "name _id role"
  );
  if (!comments)
    throw new AppError(400, "Comments not found", "Get Comments by Task Error");

  sendResponse(res, 200, true, comments, null, "Get Comments by Task success");
});

module.exports = commentController;
