const mongoose = require("mongoose");
const { AppError, sendResponse } = require("../helpers/utils");
const User = require("../models/User");

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const nameFound = await User.findOne({ name: req.body.name });
    if (nameFound)
      throw new AppError(400, "Bad Request", "User already exists!");

    const info = req.body;
    // if (!info || Object.keys(info).length === 0)
    //   throw new AppError(400, "Bad request", "Create user error");
    const created = await User.create(info);
    sendResponse(res, 200, true, created, null, "Create user success");
  } catch (error) {
    next(error);
  }
};

userController.getUsers = async (req, res, next) => {
  try {
    const name = req.query.name;
    const role = req.query.role;
    const filter = { name, role };
    if (!name) delete filter.name;
    if (!role) delete filter.role;
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .populate("responsibleFor", "name description status");
    if (!users) throw new AppError(400, "Bad Request", "Users not found!");
    sendResponse(res, 200, true, users, null, "Get all users success");
  } catch (error) {
    next(error);
  }
};

userController.getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // if (!mongoose.isValidObjectId(id))
    //   throw new AppError(400, "Bad Request", "Invalid ID");
    const filter = { _id: id };
    const singleUser = await User.find(filter)
      .sort({ createdAt: -1 })
      .populate("responsibleFor", "name description status");
    if (!singleUser) throw new AppError(400, "Bad Request", "User not found!");
    sendResponse(res, 200, true, singleUser, null, "Get single user success");
  } catch (error) {
    next(error);
  }
};

userController.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // if (!mongoose.isValidObjectId(id))
    //   throw new AppError(400, "Bad Request", "Invalid ID");
    const deleted = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, runValidators: true }
    );
    if (!deleted) throw new AppError(400, "Bad Request", "User not found!");
    sendResponse(res, 200, true, deleted, null, "Delete user success");
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
