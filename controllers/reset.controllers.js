const mongoose = require("mongoose");
const crypto = require("crypto");
const { promisify } = require("util");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Reset = require("../models/Reset");
const User = require("../models/User");
const { sendResetLink } = require("../helpers/emails");
const bcrypt = require("bcryptjs");

const resetController = {};

resetController.createReset = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const resetToken = crypto.randomBytes(48).toString("base64url");

  const user = await User.findOne({ email });
  if (!user) throw new AppError(400, "User not found", "Reset Password Error");

  let reset = await Reset.findOne({ email });
  if (reset)
    // delete old reset if exists
    await Reset.findOneAndDelete({ email });

  reset = await Reset.create({ email, resetToken });

  const link = `${req.protocol}://${req.get(
    "host"
  )}/api/resets/reset_page?email=${email}&token=${resetToken}`;

  await sendResetLink(email, link);

  sendResponse(
    res,
    200,
    true,
    { link, reset },
    null,
    "Reset link send successful"
  );
});

resetController.goToResetPage = catchAsync(async (req, res, next) => {
  const { email, token } = req.query;

  res.redirect(
    `${process.env.CLIENT_URL}/reset_password?email=${email}&token=${token}`
  );

  //   sendResponse(res, 200, true, {}, null, "Reset page redirect successful");
});

resetController.resetPassword = catchAsync(async (req, res, next) => {
  const { email, token } = req.query;
  let { password } = req.body;

  // verify token first
  let reset = await Reset.findOne({ resetToken: token });
  if (!reset)
    throw new AppError(400, "Reset not found", "Reset Password Error");

  if (email !== reset.email)
    throw new AppError(400, "Email mismatched", "Reset Password Error");

  // encrypt new password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  // update to new password
  await User.findOneAndUpdate({ email }, { password }, { new: true });

  // delete reset request in db
  await Reset.findOneAndDelete({ resetToken: token });

  //   res.redirect(`${process.env.CLIENT_URL}/login`);

  sendResponse(res, 200, true, {}, null, "Reset password successful");
});

module.exports = resetController;
