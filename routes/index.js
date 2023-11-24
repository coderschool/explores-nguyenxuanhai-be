const { sendResponse, AppError } = require("../helpers/utils.js");

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to Tasuku!");
});

router.get("/tasuku/:test", async (req, res, next) => {
  const { test } = req.params;
  try {
    //turn on to test error handling
    if (test === "error") {
      throw new AppError(401, "Access denied", "Authentication Error");
    } else {
      sendResponse(res, 200, true, { data: "tasks" }, null, "tasks success");
    }
  } catch (err) {
    next(err);
  }
});

const authApi = require("./auth.api");
router.use("/auth", authApi);

const userRouter = require("./user.api.js");
router.use("/users", userRouter);

const taskRouter = require("./task.api.js");
router.use("/tasks", taskRouter);

const projectRouter = require("./project.api.js");
router.use("/projects", projectRouter);

const invitationRouter = require("./invitation.api.js");
router.use("/invitations", invitationRouter);

const commentRouter = require("./comment.api.js");
router.use("/comments", commentRouter);

const notificationRouter = require("./notification.api.js");
router.use("/notifications", notificationRouter);

const resetRouter = require("./reset.api.js");
router.use("/resets", resetRouter);

module.exports = router;
