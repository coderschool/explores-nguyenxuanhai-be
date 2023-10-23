const mongoose = require("mongoose");
const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Comment = require("../models/Comment");

const notificationController = {};

notificationController.getNotificationsByUser = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;
    const currentUserRole = req.userRole;

    let { userId } = req.params;

    const notifications = await Notification.find();

    if (!notifications)
      throw new AppError(
        400,
        "Notifications not found",
        "Get Notifications by User Error"
      );

    sendResponse(
      res,
      200,
      true,
      notifications,
      null,
      "Get Notifications by User success"
    );
  }
);

module.exports = notificationController;
