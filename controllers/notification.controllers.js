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

notificationController.getSubscription = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  });

  let counter = 0;

  // Send a message on connection
  res.write("event: connected\n");
  res.write(`data: You are now subscribed!\n`);
  res.write(`id: ${counter}\n\n`);
  counter += 1;

  // Send a subsequent message every five seconds
  setInterval(() => {
    // Serverside implementation of event 'current-date'
    res.write("event: current-date\n");
    res.write(`data: ${new Date().toLocaleString()}\n`);
    res.write(`id: ${counter}\n\n`);
    counter += 1;
  }, 5000);

  // Close the connection when the client disconnects
  req.on("close", () => res.end("OK"));
});

module.exports = notificationController;
