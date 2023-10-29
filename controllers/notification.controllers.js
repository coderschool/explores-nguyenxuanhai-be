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

    const notifications = await Notification.find({
      forUser: userId,
      isRead: false,
    }).sort({ createdAt: -1 });

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

notificationController.getNotificationsByUserRealTime = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;
    const currentUserRole = req.userRole;

    let { userId } = req.params;

    let notifications = await Notification.find({
      forUser: userId,
      isRead: false,
    }).sort({ createdAt: -1 });

    if (!notifications)
      throw new AppError(
        400,
        "Notifications not found",
        "Get Notifications by User Error"
      );

    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };

    res.writeHead(200, headers);

    // res.write("event: notifications\n");
    // res.write(`data: ${JSON.stringify(notifications)}\n`);
    // res.write(`id: \n\n`);

    let interValId = setInterval(async () => {
      let afterArr = await Notification.find({
        forUser: userId,
        isRead: false,
      }).sort({ createdAt: -1 });

      let isUpdated = Boolean(
        JSON.stringify(notifications.map((noti) => noti._id)) !==
          JSON.stringify(afterArr.map((noti) => noti._id))
      );

      if (isUpdated) {
        notifications = afterArr;
        res.write("event: notifications\n");
        res.write(`data: ${JSON.stringify(notifications)}\n`);
        res.write(`id: \n\n`);
      }
    }, 5000);

    req.on("close", () => {
      console.log("client dropped me");
      clearInterval(interValId);
      res.end("OK");
    });
  }
);

notificationController.markReadAllNotifications = async (req, res, next) => {
  try {
    // await Notification.updateMany({}, { $set: { isRead: true } });
    await Notification.deleteMany({});

    sendResponse(
      res,
      200,
      true,
      {},
      null,
      "Mark all notifications as read success"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = notificationController;
