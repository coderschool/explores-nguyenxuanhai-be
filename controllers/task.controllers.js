const mongoose = require("mongoose");
const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");
const Project = require("../models/Project");

const taskController = {};

// taskController.createTask = async (req, res, next) => {
//   try {
//     const info = req.body;
//     if (!info || Object.keys(info).length === 0)
//       throw new AppError(400, "Bad request", "Create task error");
//     const assigneeId = req.body.assignedTo;
//     // if (assigneeId && !mongoose.isValidObjectId(assigneeId))
//     //   throw new AppError(400, "Bad request", "Invalid user ID");

//     const created = await Task.create(info);

//     if (assigneeId) {
//       let assignee = await User.findById(assigneeId);
//       if (!assignee)
//         throw new AppError(400, "Bad request", "Assignee not found!");

//       assignee.responsibleFor.push(created._id);
//       assignee = await assignee.save();
//     }

//     sendResponse(res, 200, true, created, null, "Create task success");
//   } catch (error) {
//     next(error);
//   }
// };

taskController.createTask = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  const info = req.body;
  if (!info || Object.keys(info).length === 0)
    throw new AppError(400, "Bad request", "Create task error");

  const assigneeId = req.body.assignedTo;
  const projectId = req.body.inProject;

  // info.creator = currentUserId;

  let task = await Task.create(info);

  //   push task to new assignee responsibleFor array
  if (assigneeId) {
    let assignee = await User.findById(assigneeId);
    if (!assignee)
      throw new AppError(400, "Bad request", "Assignee not found!");

    assignee.responsibleFor.push(task._id);
    assignee = await assignee.save();
  }

  //   push task to project includeTasks array
  let project = await Project.findById(projectId);
  if (!project) throw new AppError(400, "Bad request", "Project not found");

  project.includeTasks.push(task._id);
  project = await project.save();

  // task = await task.populate("creator");

  sendResponse(res, 200, true, task, null, "Create task success");
});

taskController.getAllTasks = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  // use rest operator to put the other queries in filter obj
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  // set up search queries
  const filterConditions = [{ isDeleted: false }];
  // query for assignee
  if (filter.assignee) {
    const assignee = await User.findOne({
      // search for user by name, ignore caps; but better to use getSingleUser
      name: { $regex: filter.assignee, $options: "i" },
    });
    if (!assignee)
      throw new AppError(400, "Assignee not found", "Get All Tasks Error");
    const assigneeId = assignee._id;
    filterConditions.push({
      assignedTo: { _id: assigneeId },
    });
  }
  // query for status and priority
  if (filter.status) {
    filterConditions.push({
      status: filter.status,
    });
  }
  if (filter.priority) {
    filterConditions.push({
      priority: filter.priority,
    });
  }
  // limited access for non-managers (can only see unassigned tasks)
  if (currentUserRole !== "manager") {
    filterConditions.push({ assignedTo: undefined });
  }
  // create filterCriteria based on filterConditions (reusable for other cases)
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  // find total tasks number (for pagination)
  const count = await Task.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1); // tasks number before chosen page

  const tasks = await Task.find(filterCriteria)
    .sort({ createdAt: -1 })
    .populate("assignedTo", "name")
    .skip(offset)
    .limit(limit);
  if (!tasks) throw new AppError(400, "Task not found", "Get All Tasks Error");

  sendResponse(
    res,
    200,
    true,
    { tasks, totalPages, count },
    null,
    "Get all tasks success"
  );
});

taskController.getSingleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(req.params);

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

taskController.editTask = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  const taskId = req.params.id;
  const assigneeId = req.body.assignedTo;

  let task = await Task.findById(taskId);
  if (!task) throw new AppError(400, "Bad request", "Task not found");

  // only manager or assignee can edit
  if (currentUserRole !== "manager" && currentUserId !== task.assignedTo)
    throw new AppError(
      401,
      "Only manager or assignee can edit task",
      "Edit Task Error"
    );

  if (task.status === "done" && req.body.status !== "archive")
    throw new AppError(
      400,
      "Bad Request",
      "Completed tasks can only be archived"
    );

  const prevAssigneeId = task.assignedTo
    ? task.assignedTo.toString()
    : undefined;
  if (assigneeId && prevAssigneeId === assigneeId)
    throw new AppError(
      400,
      "Bad Request",
      "Task already assigned to this user"
    );

  // Object.assign(task, { ...req.body });
  // can only update certain fields
  const allows =
    currentUserRole === "manager"
      ? [
          "description",
          "status",
          "priority",
          "dueDate",
          "assignedTo",
          // "inProject",
        ]
      : ["status"];
  allows.forEach((field) => {
    // update if field isn't empty
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  task = await task.save();

  if (assigneeId) {
    // remove task from prev assignee responisbleFor array
    if (prevAssigneeId) {
      let prevAssignee = await User.findById(prevAssigneeId);
      if (!prevAssignee)
        throw new AppError(400, "Bad request", "Previous assignee not found");
      prevAssignee.responsibleFor = prevAssignee.responsibleFor.filter(
        (item) => item.toString() !== task._id.toString()
      );
      prevAssignee = await prevAssignee.save();
    }

    //   push task to new assignee responsibleFor array
    let assignee = await User.findById(assigneeId);
    if (!assignee) throw new AppError(400, "Bad request", "Assignee not found");

    assignee.responsibleFor.push(task._id);
    assignee = await assignee.save();
  }

  sendResponse(res, 200, true, task, null, "Update task success");
});

module.exports = taskController;
