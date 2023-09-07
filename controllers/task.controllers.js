const mongoose = require("mongoose");
const { AppError, sendResponse } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");

const taskController = {};

taskController.createTask = async (req, res, next) => {
  try {
    const info = req.body;
    if (!info || Object.keys(info).length === 0)
      throw new AppError(400, "Bad request", "Create task error");
    const assigneeId = req.body.assignedTo;
    // if (assigneeId && !mongoose.isValidObjectId(assigneeId))
    //   throw new AppError(400, "Bad request", "Invalid user ID");

    const created = await Task.create(info);

    if (assigneeId) {
      let assignee = await User.findById(assigneeId);
      if (!assignee)
        throw new AppError(400, "Bad request", "Assignee not found!");

      assignee.responsibleFor.push(created._id);
      assignee = await assignee.save();
    }

    sendResponse(res, 200, true, created, null, "Create task success");
  } catch (error) {
    next(error);
  }
};

taskController.getTasks = async (req, res, next) => {
  try {
    const name = req.query.name;
    const status = req.query.status;
    const filter = { name, status };
    if (!name) delete filter.name;
    if (!status) delete filter.status;
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name");
    if (!tasks) throw new AppError(400, "Bad request", "Tasks not found!");

    sendResponse(res, 200, true, tasks, null, "Get all tasks success");
  } catch (error) {
    next(error);
  }
};

taskController.getSingleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    // if (!mongoose.isValidObjectId(id))
    //   throw new AppError(400, "Bad request", "Invalid ID");
    const filter = { _id: id };
    const singleTask = await Task.find(filter).populate("assignedTo", "name");
    if (!singleTask) throw new AppError(400, "Bad request", "Task not found!");

    sendResponse(res, 200, true, singleTask, null, "Get single task success");
  } catch (error) {
    next(error);
  }
};

taskController.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    // if (!mongoose.isValidObjectId(id))
    //   throw new AppError(400, "Bad request", "Invalid ID");
    const deleted = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, runValidators: true }
    );
    if (!deleted) throw new AppError(400, "Bad request", "Task not found!");
    sendResponse(res, 200, true, deleted, null, "Delete task success");
  } catch (error) {
    next(error);
  }
};

taskController.editTask = async (req, res, next) => {
  const targetId = req.params.id;
  const assigneeId = req.body.assignedTo;
  try {
    // if (!mongoose.isValidObjectId(targetId))
    //   throw new AppError(400, "Bad request", "Invalid ID");
    // if (assigneeId && !mongoose.isValidObjectId(assigneeId))
    //   throw new AppError(400, "Bad request", "Invalid user ID");

    let taskFound = await Task.findById(targetId);
    if (!taskFound) throw new AppError(400, "Bad request", "Task not found");

    if (taskFound.status === "done" && req.body.status !== "archive")
      throw new AppError(
        400,
        "Bad Request",
        "Completed tasks can only be archived"
      );

    const prevAssigneeId = taskFound.assignedTo
      ? taskFound.assignedTo.toString()
      : undefined;
    if (assigneeId && prevAssigneeId === assigneeId)
      throw new AppError(
        400,
        "Bad Request",
        "Task already assigned to this user"
      );
    Object.assign(taskFound, { ...req.body });

    taskFound = await taskFound.save();

    if (assigneeId) {
      // remove task from prev assignee responisbleFor array
      if (prevAssigneeId) {
        let prevAssignee = await User.findById(prevAssigneeId);
        if (!prevAssignee)
          throw new AppError(400, "Bad request", "Previous assignee not found");
        prevAssignee.responsibleFor = prevAssignee.responsibleFor.filter(
          (task) => task.toString() !== taskFound._id.toString()
        );
        prevAssignee = await prevAssignee.save();
      }

      //   push task to new assignee responsibleFor array
      let assignee = await User.findById(assigneeId);
      if (!assignee)
        throw new AppError(400, "Bad request", "Assignee not found");

      assignee.responsibleFor.push(taskFound._id);
      assignee = await assignee.save();
    }

    sendResponse(res, 200, true, taskFound, null, "Update task success");
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
