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

  const project = await Project.create({
    name,
    description,
    includeMembers: [currentUserId],
  });

  // add project to user's memberOf arr
  let user = await User.findById(currentUserId);
  user.memberOf.push(project._id);
  user = await user.save();

  sendResponse(res, 200, true, project, null, "Create task success");
});

projectController.getAllProjects = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  // use rest operator to put the other queries in filter obj
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  // set up search queries
  const filterConditions = [{ isDeleted: false }];

  // query for project name
  if (filter.name) {
    filterConditions.push({
      name: { $regex: filter.assignee, $options: "i" },
    });
  }
  // create filterCriteria based on filterConditions (reusable for other cases)
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const projects = await Project.find(filterCriteria)
    .sort({ createdAt: -1 })
    .populate("includeTasks");
  if (!projects)
    throw new AppError(400, "Projects not found", "Get All Tasks Error");

  sendResponse(res, 200, true, projects, null, "Get all projects success");
});

projectController.getProjectsByUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  let { userId } = req.params;

  const user = await User.findById(userId).populate("memberOf");
  if (!user)
    throw new AppError(400, "User not found", "Get Projects by User Error");

  const projects = user.memberOf;
  if (!projects)
    throw new AppError(400, "Projects not found", "Get Projects by User Error");

  sendResponse(res, 200, true, projects, null, "Get Projects by User success");
});

projectController.getSingleProject = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;

  const projectId = req.params.id;

  const filter = { _id: projectId };
  const project = await Project.findOne(filter)
    .populate("includeTasks")
    .populate("includeMembers")
    .exec();
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

  // push added member to includeMembers arr
  const { addedMemberId } = req.body;
  if (addedMemberId) {
    if (!mongoose.isValidObjectId(addedMemberId))
      throw new AppError(400, "Bad request", "Invalid added member ObjectId");

    let addedMember = await User.findById(addedMemberId);
    if (!addedMember)
      throw new AppError(400, "Bad request", "Added member not found");

    if (project.includeMembers.includes(addedMemberId))
      throw new AppError(400, "Bad request", "Already a member");

    project.includeMembers.push(addedMemberId);
    project = await project.save();

    // push project to memberOf arr
    addedMember.memberOf.push(project._id);
    addedMember = await addedMember.save();
  }

  // // remove removed member from includeMembers arr
  const { removedMemberId } = req.body;
  if (removedMemberId) {
    if (!mongoose.isValidObjectId(removedMemberId))
      throw new AppError(400, "Bad request", "Invalid removed member ObjectId");

    let removedMember = await User.findById(removedMemberId);
    if (!removedMember)
      throw new AppError(400, "Bad request", "Removed member not found");

    project.includeMembers = project.includeMembers.filter(
      (item) => item.toString() !== removedMemberId.toString()
    );
    project = await project.save();

    // remove project from memberOf arr
    removedMember.memberOf = removedMember.memberOf.filter(
      (item) => item.toString() !== project._id.toString()
    );
    removedMember = await removedMember.save();
  }

  const editedProject = await Project.findById(project._id)
    .populate("includeTasks")
    .populate("includeMembers")
    .exec();

  sendResponse(res, 200, true, editedProject, null, "Update project success");
});

module.exports = projectController;
